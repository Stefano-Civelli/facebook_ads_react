import pandas as pd
import os
import sys
PROJ_ROOT = os.path.abspath(os.path.join(os.pardir))
sys.path.append(PROJ_ROOT)

from util import assign_macro_party, safe_eval

def read_data(file_path, start_date, end_date):

    df = pd.read_csv(file_path)
    
    if 'Unnamed: 0' in df.columns:
        df.drop(columns=['Unnamed: 0'], inplace=True)
        
        
    df['ad_creation_time'] = pd.to_datetime(df['ad_creation_time'])
    df['ad_delivery_start_time'] = pd.to_datetime(df['ad_delivery_start_time'])
    df['ad_delivery_stop_time'] = pd.to_datetime(df['ad_delivery_stop_time'], errors='coerce')  # Coerce errors for NaNs

    df['tokenized_text'] = df['tokenized_text'].apply(safe_eval)
    df['demographic_distribution'] = df['demographic_distribution'].apply(safe_eval)
    df['region_distribution'] = df['region_distribution'].apply(safe_eval)
    df['sentences'] = df['sentences'].apply(safe_eval)
    df['sentence_confidence_scores'] = df['sentence_confidence_scores'].apply(safe_eval)


    # Drop rows where ad_delivery_stop_time or ad_delivery_start_time is missing
    df = df.dropna(subset=['ad_delivery_stop_time', 'ad_delivery_start_time'])
    # drop ads where the ad_creative_link_caption is atsijobs.com.au
    #df = df[df['ad_creative_link_caption'] != 'atsijobs.com.au']
    # drop ads where the page_name is Indigenous Employment Australia
    #df = df[df['page_name'] != 'Indigenous Employment Australia']
    df = df[(df['ad_delivery_start_time'] >= start_date) & (df['ad_delivery_stop_time'] <= end_date)]

    # drop columns with more than 70% missing values
    threshold = 0.7 # TODO Maybe this is the reason we are deleting some UAP ads.
    df = df.loc[:, df.isnull().mean() < threshold]

    # Create new columns for filtering
    df['high_persuasive'] = df['persuasive_ratio'] > 0.8
    df['low_persuasive'] = df['persuasive_ratio'] < 0.2
    df['medium_persuasive'] = ~(df['high_persuasive'] | df['low_persuasive'])
    df['persuasiveness'] = df['persuasive_ratio'].apply(lambda x: 'High' if x > 0.8 else 'Low' if x < 0.2 else 'Other')
    df['macro_party'] = df.apply(assign_macro_party, axis=1)
    df['has_party'] = df['macro_party'].notnull()
    # main party when macro_party is not null and not 'Other'
    df['is_main_party'] = df['macro_party'].notnull() & (df['macro_party'] != 'Other')

    return df
