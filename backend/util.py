import ast
from datetime import datetime
import pandas as pd


def clean_string(name):
    if name.startswith('df_'):
        return name[3:].capitalize()
    elif name.endswith('_df'):
        return name[:-3].capitalize()
    else:
        return name.capitalize()
    
def safe_eval(x):
        if pd.isna(x) or x == '':
            return None
        try:
            return ast.literal_eval(x)
        except (ValueError, SyntaxError):
            return None
        



def assign_macro_party(row):
    """
    Assigns a macro party to each row based on the party column
    """
    if row['party'] in ['Liberal', 'Liberal Nationals (QLD)', 'Nationals', 'Country Liberal (NT)', 'New Liberals']:
        return 'Liberal'
    elif row['party'] == 'Labor':
        return 'Labor'
    elif row['party'] == 'Greens':
        return 'Green'
    elif row['party'] == 'Independent':
        return 'Independent'
    else:
        return 'Other'
    
def assign_macro_party_with_uap(row):
    if row['party'] in ['Liberal', 'Liberal Nationals (QLD)', 'Nationals', 'Country Liberal (NT)', 'New Liberals']:
        return 'Liberal'
    elif row['party'] == 'Labor':
        return 'Labor'
    elif row['party'] == 'Greens':
        return 'Green'
    elif row['party'] == 'Independent':
        return 'Independent'
    elif row['party'] == 'United Australia Party':
        return 'United Australia Party'
    else:
        return 'Other'
    

def expand_rows_spreading_spend(row):
    days = pd.date_range(start=row['ad_delivery_start_time'], end=row['ad_delivery_stop_time'])
    days_count = len(days)
    return pd.DataFrame({
        'date': days,
        'mean_spend': row['mean_spend'] / days_count,  # Distribute spend evenly
        'mean_impressions': row['mean_impressions'] / days_count,
        'spend.lower_bound': row['spend.lower_bound'] / days_count,
        'spend.upper_bound': row['spend.upper_bound'] / days_count,
        'impressions.lower_bound': row['impressions.lower_bound'] / days_count,
        'impressions.upper_bound': row['impressions.upper_bound'] / days_count,
        'ad_id': row['id'],
    })



def get_daily_data(df):
    # Apply the function to each row and concatenate the results
    expanded_df = pd.concat([expand_rows_spreading_spend(row) for index, row in df.iterrows()])
    
    # Aggregate the expanded DataFrame by day
    daily_data = expanded_df.groupby('date').agg({
        'mean_spend': 'sum',
        'mean_impressions': 'sum',
        'spend.lower_bound': 'sum',
        'spend.upper_bound': 'sum',
        'impressions.lower_bound': 'sum',
        'impressions.upper_bound': 'sum',
        'ad_id': 'count'
    }).rename(columns={'ad_id': 'ad_count'})
    
    # Calculate the 3-day moving averages for all relevant metrics
    metrics = ['mean_spend', 'mean_impressions', 'ad_count', 
               'spend.lower_bound', 'spend.upper_bound', 
               'impressions.lower_bound', 'impressions.upper_bound']
    
    for metric in metrics:
            daily_data[f'{metric}_ma3'] = daily_data[metric].rolling(window=3).mean()
        
    return daily_data






def get_and_validate_dates(start_date_str, end_date_str):
    if not start_date_str or not end_date_str:
        return None, None, {"error": "Both startDate and endDate are required."}, 400
    
    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d")
    except ValueError:
        return None, None, {"error": "Invalid date format. Use YYYY-MM-DD"}, 400
    
    return start_date, end_date, None, 200



def apply_date_interval(df, start_date, end_date):
    return df[(df['ad_delivery_start_time'] >= start_date) & (df['ad_delivery_stop_time'] <= end_date)]