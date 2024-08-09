import json
import os
import sys

from util import clean_string, get_and_validate_dates, get_daily_data
print(f'default sys.path: {sys.path}')
from flask import Flask, jsonify, request
import pandas as pd
from data_processing import read_data
from flask_cors import CORS
from datetime import datetime

PROJ_ROOT = os.path.abspath(os.path.join(os.pardir))
sys.path.append(PROJ_ROOT)
print(f'Project root: {PROJ_ROOT}')

# ---------------------------- Parameters ---------------------------- #
app = Flask(__name__)
CORS(app)

file_path = 'data/2022_aus_elections_mar_to_may_4_comparison_withkeywords.csv'

election_day = pd.Timestamp('2022-05-21')
start_date = pd.Timestamp('2022-02-15')
end_date = pd.Timestamp('2022-06-01')


# ---------------------------- Parameters ---------------------------- #

# Load the CSV data once at startup
df, party_dfs = read_data(file_path, start_date, end_date)



# Prepare the data to be served
parties_spend = [(party, party_df['mean_spend'].sum()) for party, party_df in party_dfs.items()]
parties_spend.sort(key=lambda x: x[1], reverse=True)

party_spend_data = [{'label': clean_string(party), 'value': spend} for party, spend in parties_spend]



def prepare_data_for_timeseries_api(df1, df2=None):
    print('Preparing data for time series API')
    daily_data_df1 = get_daily_data(df1)


    data = []
    
    for date, row in daily_data_df1.iterrows():
        entry = {
            "date": date.strftime("%Y-%m-%d"),
            "df1_mean_spend": row['mean_spend_ma3'],
            "df1_mean_impressions": row['mean_impressions_ma3'],
            "df1_ad_count": row['ad_count_ma3'],
            "df1_spend_lower": row['spend.lower_bound_ma3'],
            "df1_spend_upper": row['spend.upper_bound_ma3'],
            "df1_impressions_lower": row['impressions.lower_bound_ma3'],
            "df1_impressions_upper": row['impressions.upper_bound_ma3']
        }


        
        # if df2 is not None:
        #     daily_data_df2 = get_daily_data(df2)
        #     if date in daily_data_df2.index:
        #         df2_row = daily_data_df2.loc[date]
        #         entry.update({
        #             "df2_mean_spend": df2_row['mean_spend_ma3'],
        #             "df2_mean_impressions": df2_row['mean_impressions_ma3'],
        #             "df2_ad_count": df2_row['ad_count_ma3'],
        #             "df2_spend_lower": df2_row['spend.lower_bound_ma3'],
        #             "df2_spend_upper": df2_row['spend.upper_bound_ma3'],
        #             "df2_impressions_lower": df2_row['impressions.lower_bound_ma3'],
        #             "df2_impressions_upper": df2_row['impressions.upper_bound_ma3']
        #         })

        # if date is previous to 17 february don't append to data
        if date > pd.Timestamp('2022-02-17'):
            data.append(entry)
    
    return data

time_series_data = prepare_data_for_timeseries_api(party_dfs['liberal_df'], party_dfs['labor_df'])


print('Server ready')
# ---------------------------- API ---------------------------- #
@app.route('/api/party-spend')
def get_party_spend():
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')

    start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
    if error_response:
        return jsonify(error_response), status_code
    data = {
        'title': 'Party Spend',
        'description': 'Total spend by each party',
        'x_label': 'Spend (Millions $)',
        'y_label': 'Party',
        'data': party_spend_data
    }
    return jsonify(data)


@app.route('/api/spend-by-term-and-party')
def get_spend_by_term_and_party():
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')

    start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
    if error_response:
        return jsonify(error_response), status_code
    data = {
        'title': 'Spend by Term and Party',
        'description': 'Total spend by each party and term',
        'x_label': 'Spend (Millions $)',
        'y_label': 'Term',
        'data': party_spend_data
    }
    return jsonify(data)

@app.route('/api/spend-by-electorate-and-party')
def get_spend_by_electorate_and_party():
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')

    start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
    if error_response:
        return jsonify(error_response), status_code
    data = {
        'title': 'Spend by Electorate and Party',
        'description': 'Total spend by each party and electorate',
        'x_label': 'Spend (Millions $)',
        'y_label': 'Electorate',
        'data': party_spend_data
    }
    return jsonify(data)

@app.route('/api/top-funding-entities')
def get_top_funding_entities():
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')

    start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
    if error_response:
        return jsonify(error_response), status_code
    data = {
        'title': 'Top Funding Entities',
        'description': 'Top funding entities',
        'x_label': 'Spend (Millions $)',
        'y_label': 'Entity',
        'data': party_spend_data
    }
    return jsonify(data)


@app.route('/api/time-series', methods=['GET'])
def get_time_series():
    start_date_str = request.args.get('startDate')
    end_date_str = request.args.get('endDate')

    start_date, end_date, error_response, status_code = get_and_validate_dates(start_date_str, end_date_str)
    if error_response:
        return jsonify(error_response), status_code
    
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


