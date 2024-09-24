import os
import sys

from util import apply_date_interval, clean_string, get_and_validate_dates, get_daily_data
print(f'default sys.path: {sys.path}')
from flask import Flask, jsonify, request
import pandas as pd
from data_processing import read_data
from flask_cors import CORS
from datetime import datetime
import config

PROJ_ROOT = os.path.abspath(os.path.join(os.pardir))
sys.path.append(PROJ_ROOT)
print(f'Project root: {PROJ_ROOT}')


# set CORS so that browser doesn't block requests
app = Flask(__name__)
CORS(app)

# Load the CSV data once at startup
df = read_data(config.file_path, config.default_start_date, config.default_end_date)


# Prepare the data to be served
party_spend_data = df[df['is_main_party']].groupby('macro_party')['mean_spend'].sum().reset_index()
party_spend_data = party_spend_data.sort_values('mean_spend', ascending=False)
party_spend_data = [{'label': clean_string(row['macro_party']), 'value': row['mean_spend']} 
                    for _, row in party_spend_data.iterrows()]



def prepare_data_for_timeseries_api(df):
    print('Preparing data for time series API')
    processed_data = {}
    
    # Get unique values of macro_party, including None
    unique_parties = df['macro_party'].unique()
    
    for party in unique_parties:
        if pd.isna(party): # TODO make sure this works, otherwise put None
            party_df = df[df['macro_party'].isna()]
            key = 'None'
        else:
            party_df = df[df['macro_party'] == party]
            key = party
        
        daily_data = get_daily_data(party_df)
        processed_data[key] = daily_data
    
    # Add an 'all' key for the entire dataset
    processed_data['All'] = get_daily_data(df)
    
    return processed_data


def get_timeseries_data(processed_data, party_str):
    """takes processed_timeseries_daily_data as input"""
    if party_str not in processed_data:
        raise ValueError(f"Data for '{party_str}' not found in processed data")
    
    daily_data = processed_data[party_str]
    
    data = []
    for date, row in daily_data.iterrows():
        entry = {
            "date": date.strftime("%Y-%m-%d"),
            "total_impressions": row['mean_impressions_total_ma3'],
            "high_persuasive_impressions": row['mean_impressions_high_persuasive_ma3'],
            "low_persuasive_impressions": row['mean_impressions_low_persuasive_ma3'],
            "total_spend": row['mean_spend_total_ma3'],
            "high_persuasive_spend": row['mean_spend_high_persuasive_ma3'],
            "low_persuasive_spend": row['mean_spend_low_persuasive_ma3']
        }
        data.append(entry)
    
    return data


#processed_timeseries_daily_data = prepare_data_for_timeseries_api(df) # TODO is there a way to make this faster so I don't need to pre-compute it?

print('Server ready')

# ---------------------------- API ---------------------------- #
# @app.route('/api/party-spend')
# def get_party_spend():
#     start_date_str = request.args.get('startDate')
#     end_date_str = request.args.get('endDate')

#     start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
#     if error_response:
#         return jsonify(error_response), status_code
#     data = {
#         'title': 'Party Spend',
#         'description': 'Total spend by each party',
#         'x_label': 'Spend (Millions $)',
#         'y_label': 'Party',
#         'data': party_spend_data
#     }
#     return jsonify(data)


@app.route('/api/party-spend')
def get_party_spend():
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')

    start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
    if error_response:
        return jsonify(error_response), status_code

    # Filter the dataframe based on the date range and main parties
    filtered_df = df[(df['ad_delivery_start_time'] >= start_date) & 
                     (df['ad_delivery_stop_time'] <= end_date) & 
                     (df['is_main_party'])] # TODO non credo qua ci vada is_main_party, controllare anche da altre parti

    # Group by party and persuasiveness, and calculate metrics
    grouped_data = filtered_df.groupby(['macro_party', 'persuasiveness']).agg({
        'mean_spend': 'sum',
        'mean_impressions': 'sum',
        'id': 'count'
    }).reset_index()

    # Pivot the data to get the desired format
    party_data = grouped_data.pivot(index='macro_party', columns='persuasiveness', 
                                    values=['mean_spend', 'mean_impressions', 'id'])

    # Flatten column names and rename
    party_data.columns = [f'{col[1]}_{col[0]}' for col in party_data.columns]
    party_data = party_data.rename(columns={
        'high_mean_spend': 'high_persuasive_spend',
        'low_mean_spend': 'low_persuasive_spend',
        'high_mean_impressions': 'high_persuasive_impressions',
        'low_mean_impressions': 'low_persuasive_impressions',
        'high_id': 'number_high_persuasive',
        'low_id': 'number_low_persuasive'
    })

    # Calculate totals
    party_data['total_spend'] = filtered_df['mean_spend'].sum()
    party_data['total_impressions'] = filtered_df['mean_impressions'].sum()
    party_data['number_of_ads'] = filtered_df.shape[0]

    # Sort by total spend and reset index
    party_data = party_data.sort_values('total_spend', ascending=False).reset_index()

    # Convert to list of dictionaries
    party_spend_data = party_data.to_dict('records')

    # Clean party names
    for item in party_spend_data:
        item['macro_party'] = clean_string(item['macro_party'])

    data = {
        'title': 'Party Spend and Metrics',
        'description': 'Total spend and other metrics by each party',
        'data': party_spend_data
    }

    return jsonify(data)

@app.route('/api/general-stats')
def get_basic_stats():
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')

    start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)

    if error_response:
        return jsonify(error_response), status_code
    
    date_filtered_df = apply_date_interval(df, start_date, end_date)
    date_filtered_high_persuasive = date_filtered_df[date_filtered_df['high_persuasive']]
    date_filtered_low_persuasive = date_filtered_df[date_filtered_df['low_persuasive']]

    data = {
        'title': 'General Stats',
        'description': 'General statistics',
        'data': {
            'total_spend': date_filtered_df['mean_spend'].sum(),
            'total_spend_high_persuasive': date_filtered_high_persuasive['mean_spend'].sum(),
            'total_spend_low_persuasive': date_filtered_low_persuasive['mean_spend'].sum(),
            'total_spend_other': date_filtered_df[date_filtered_df['medium_persuasive']]['mean_spend'].sum(),
            'total_impressions': date_filtered_df['mean_impressions'].sum(),
            'total_impressions_high_persuasive': date_filtered_high_persuasive['mean_impressions'].sum(),
            'total_impressions_low_persuasive': date_filtered_low_persuasive['mean_impressions'].sum(),
            'total_impressions_other': date_filtered_df[date_filtered_df['medium_persuasive']]['mean_impressions'].sum(),
            'total_ads': date_filtered_df.shape[0],
            'total_high_persuasive_ads': date_filtered_high_persuasive.shape[0],
            'total_low_persuasive_ads': date_filtered_low_persuasive.shape[0],
            'total_other_ads': date_filtered_df[date_filtered_df['medium_persuasive']].shape[0],
            'cost_per_thousand_impressions': date_filtered_df['mean_spend'].sum() / date_filtered_df['mean_impressions'].sum() * 1000,
            'cost_per_thousand_impressions_high_persuasive': date_filtered_high_persuasive['mean_spend'].sum() / date_filtered_high_persuasive['mean_impressions'].sum() * 1000,
            'cost_per_thousand_impressions_low_persuasive': date_filtered_low_persuasive['mean_spend'].sum() / date_filtered_low_persuasive['mean_impressions'].sum() * 1000,
            'cost_per_thousand_impressions_other': date_filtered_df[date_filtered_df['medium_persuasive']]['mean_spend'].sum() / date_filtered_df[date_filtered_df['medium_persuasive']]['mean_impressions'].sum() * 1000,
            'average_spend_per_ad': date_filtered_df['mean_spend'].mean(),
            'average_impressions_per_ad': date_filtered_df['mean_impressions'].mean(),
            'total_number_of_unique_funding_entities': date_filtered_df['funding_entity'].nunique(),
            'proportion_high_persuasive': date_filtered_high_persuasive.shape[0] / date_filtered_df.shape[0], # makes sene only when df is the main df
            'proportion_low_persuasive': date_filtered_low_persuasive.shape[0] / date_filtered_df.shape[0], # makes sene only when df is the main df
            'proportion_other': date_filtered_df[date_filtered_df['medium_persuasive']].shape[0] / date_filtered_df.shape[0], # makes sene only when df is the main df
            'percentage_ads_persuasive_ration_gt_0': date_filtered_df[date_filtered_df['persuasive_ratio'] > 0].shape[0] / date_filtered_df.shape[0], # makes sene only when df is the main df
            'avg_campaign_duration': (date_filtered_df['ad_delivery_stop_time'] - date_filtered_df['ad_delivery_start_time']).mean().days, # TODO check if makes sense
            'avg_campaign_duration_high_persuasive': (date_filtered_high_persuasive['ad_delivery_stop_time'] - date_filtered_high_persuasive['ad_delivery_start_time']).mean().days
        }
    }
    return jsonify(data)


@app.route('/api/spend-and-impressions-by-region')
def get_spend_and_impressions_by_region():
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')

    start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
    if error_response:
        return jsonify(error_response), status_code

    # Filter the dataframe based on date range
    filtered_df = df[(df['ad_delivery_start_time'] >= start_date) & 
                     (df['ad_delivery_stop_time'] <= end_date)]
    

    def process_data(data_df):
        rows = []
        data_df.apply(lambda row: [rows.append([row['id'], row['mean_impressions'], row['mean_spend'], rr['region'], float(rr['percentage'])])
                                   for rr in row['region_distribution'] if rr['region'] in config.australian_regions], axis=1)
        
        regional_df = pd.DataFrame(rows, columns=['id', 'impressions', 'spend', 'region', 'percentage'])

        # Aggregate data by region
        regional_data = regional_df.groupby('region').agg({
            'impressions': lambda x: (x * regional_df.loc[x.index, 'percentage']).sum(),
            'spend': lambda x: (x * regional_df.loc[x.index, 'percentage']).sum()
        }).reset_index()

        return regional_data

    # Process data for each category
    high_persuasive_data = process_data(filtered_df[filtered_df['high_persuasive']])
    low_persuasive_data = process_data(filtered_df[filtered_df['low_persuasive']])
    all_data = process_data(filtered_df)

    # Merge the data
    merged_data = pd.merge(high_persuasive_data, low_persuasive_data, on='region', suffixes=('_high', '_low'))
    merged_data = pd.merge(merged_data, all_data, on='region')

    # Create the new data structure
    structured_data = {}
    for _, row in merged_data.iterrows():
        structured_data[row['region']] = {
            'high_persuasive_spend': row['spend_high'],
            'low_persuasive_spend': row['spend_low'],
            'mean_spend': row['spend'],
            'high_persuasive_impressions': row['impressions_high'],
            'low_persuasive_impressions': row['impressions_low'],
            'mean_impressions': row['impressions']
        }

    # Prepare the response data
    data = {
        'title': 'Regional Spend and Impressions',
        'description': 'Spend and impressions by region for high persuasive, low persuasive, and all ads',
        'data': structured_data
    }

    return jsonify(data)



# @app.route('/api/spend-by-term-and-party')
# def get_spend_by_term_and_party():
#     start_date_str = request.args.get('startDate')
#     end_date_str = request.args.get('endDate')

#     start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
#     if error_response:
#         return jsonify(error_response), status_code
#     data = {
#         'title': 'Spend by Term and Party',
#         'description': 'Total spend by each party and term',
#         'x_label': 'Spend (Millions $)',
#         'y_label': 'Term',
#         'data': party_spend_data
#     }
#     return jsonify(data)

# @app.route('/api/spend-by-electorate-and-party')
# def get_spend_by_electorate_and_party():
#     start_date_str = request.args.get('startDate')
#     end_date_str = request.args.get('endDate')

#     start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
#     if error_response:
#         return jsonify(error_response), status_code
#     data = {
#         'title': 'Spend by Electorate and Party',
#         'description': 'Total spend by each party and electorate',
#         'x_label': 'Spend (Millions $)',
#         'y_label': 'Electorate',
#         'data': party_spend_data
#     }
#     return jsonify(data)

# @app.route('/api/top-funding-entities')
# def get_top_funding_entities():
#     start_date_str = request.args.get('startDate')
#     end_date_str = request.args.get('endDate')

#     start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
#     if error_response:
#         return jsonify(error_response), status_code
#     data = {
#         'title': 'Top Funding Entities',
#         'description': 'Top funding entities',
#         'x_label': 'Spend (Millions $)',
#         'y_label': 'Entity',
#         'data': party_spend_data
#     }
#     return jsonify(data)


# TODO do a final check on the API
@app.route('/api/time-series', methods=['GET'])
def get_time_series():
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')
    party_str = request.args.get('party')
    if not party_str:
        party_str = 'all'

    start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
    if error_response:
        return jsonify(error_response), status_code
    

    time_series_data = get_timeseries_data(processed_timeseries_daily_data, party_str)
    # Filter the data based on start_date and end_date
    filtered_data = [
        entry for entry in time_series_data
        if start_date <= datetime.strptime(entry["date"], "%Y-%m-%d") <= end_date
    ]
    
    response_data = {
        'title': '3-Day Moving Average Time Series',
        'description': 'Time series of spend, impressions and number of ads',
        'x_label': 'Date',
        'y_label': ['Spend (Millions $)', 'Impressions', 'Number of Ads'],
        'data': filtered_data
    }
    
    return jsonify(response_data)


# ---------------------------- API ---------------------------- #


if __name__ == '__main__':
    app.run(debug=True)


