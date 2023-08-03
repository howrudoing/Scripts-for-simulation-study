import boto3
import csv
import pandas as pd
from pandas import DataFrame
import datetime
import os.path as path
import time



client = boto3.client('mturk',aws_access_key_id = "", aws_secret_access_key = "", region_name='us-east-1',endpoint_url='https://mturk-requester-sandbox.us-east-1.amazonaws.com')


type_id = ''
filename = type_id + '.csv'


def update_summary(filter_id=type_id,filename=filename):
    def read_response(response):
        for each in response['HITs']:
            if each['HITTypeId'] == filter_id:
            #if each['HITGroupId'] == filter_id:
                if each['NumberOfAssignmentsAvailable'] > 0:
                    summary['available'] += 1
                if each['NumberOfAssignmentsCompleted'] > 0:
                    summary['completed'] +=1
                if each['NumberOfAssignmentsPending'] > 0:
                    summary['pending'] +=1
    summary = {
    'available' : 0,
    'completed' : 0,
    'pending' : 0,
    }
    response = client.list_hits(MaxResults=100)
    read_response(response)
    while 'NextToken' in response:
        response = client.list_hits(MaxResults=100,NextToken=response['NextToken'])
        read_response(response)
    if path.isfile(filename):
        pd.DataFrame(pd.Series({'timestamp':pd.to_datetime("today"),'available':summary['available'],'completed':summary['completed'],'pending':summary['pending']})).T.to_csv(filename,mode='a',header=False)
    else: #first time 
        pd.DataFrame(pd.Series({'timestamp':pd.to_datetime("today"),'available':summary['available'],'completed':summary['completed'],'pending':summary['pending']})).T.to_csv(filename)




while True:
    update_summary()
    time.sleep(30)






