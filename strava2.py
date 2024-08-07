
import requests
import pandas as pd
activities_url = "https://www.strava.com/api/v3/athlete/activities"
header = {'Authorization': 'Bearer ' + '3c5cbf203beb8159a5fbadc6276f943128b5222d'} #config.get('STRAVA_TOKEN')}
params = {'per_page': 200, 'page': 1} #max 200 per page, can only do 1 page at a time
my_dataset = requests.get(activities_url, headers=header, params=params).json() #activities 1st page
page = 0
for x in range(1,5): #loop through 4 pages of strava activities
    page +=1 
params = {'per_page': 200, 'page': page}
new_dataset = my_dataset | requests.get(activities_url, headers=header, params=params).json()

activities = pd.json_normalize(my_dataset)
# print(activities.columns) # list all columns in the table
# print(activities.shape) #dimensions of the table.

#Create new dataframe with specific columns #max_time
cols = ['name', 'type', 'distance', 'moving_time', 'total_elevation_gain', 'start_date']
activities = activities[cols]
activities = activities[activities["start_date"].str.contains("2021") == False] #remove items from 2021, only include workouts from 2022 and 2023
activities.to_csv('data_files/activities.csv', index=False)