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

    #df['tokenized_text'] = df['tokenized_text'].apply(ast.literal_eval)
    df['demographic_distribution'] = df['demographic_distribution'].apply(safe_eval)
    df['region_distribution'] = df['region_distribution'].apply(safe_eval)


    # drop rows where ad_delivery_stop_time is missing
    df = df.dropna(subset=['ad_delivery_stop_time'])
    # drop ads where the ad_creative_link_caption is atsijobs.com.au
    df = df[df['ad_creative_link_caption'] != 'atsijobs.com.au']
    # drop ads where the page_name is Indigenous Employment Australia
    df = df[df['page_name'] != 'Indigenous Employment Australia']


    df = df[df['ad_delivery_start_time'] >= start_date]
    df = df[df['ad_delivery_stop_time'] <= end_date]

    liberal_mask = (df['party'] == 'Liberal') | \
               (df['party'] == 'Liberal Nationals (QLD)') | \
               (df['party'] == 'Nationals') | \
               (df['party'] == 'Country Liberal (NT)') | \
               (df['party'] == 'New Liberals')
    # Country Liberal (NT) e New Liberals non sarebbero da considere

    labor_mask = df['party'] == 'Labor'

    greens_mask = df['party'] == 'Greens'

    independents_mask = df['party'] == 'Independent'

    other_parties_mask = ~(liberal_mask | labor_mask | greens_mask | independents_mask)

    main_parties_mask = (liberal_mask | labor_mask | greens_mask | independents_mask)

    has_a_party_mask = df['party'].notnull()

    # Using the masks to create DataFrames
    liberal_df = df[liberal_mask]
    labor_df = df[labor_mask]
    greens_df = df[greens_mask]
    independents_df = df[independents_mask]
    other_parties_df = df[other_parties_mask]
    main_parties_df = df[main_parties_mask]
    has_party_df = df[has_a_party_mask]

    all_dfs = {'liberal_df': liberal_df,
                'labor_df': labor_df,
                'greens_df': greens_df,
                'independents_df': independents_df,
                'main_parties_df': main_parties_df,
                'other_parties_df': other_parties_df,
                'has_party_df': has_party_df}

    party_dfs = {'liberal_df': liberal_df,
                'labor_df': labor_df,
                'greens_df': greens_df,
                'independents_df': independents_df}


    df['macro_party'] = df.apply(assign_macro_party, axis=1)


    return df, party_dfs







