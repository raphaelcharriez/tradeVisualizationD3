import json 

location_json = '/Users/raphaelcharriez/Downloads/ISO-3166-Countries-with-Regional-Codes-master/all/'
location_csv = r'/Users/raphaelcharriez/Downloads/country_centroids.csv'

with open(location_json + 'all.json') as json_file:
    data = json.load(json_file)
    

import pandas as pd


locs = pd.read_csv(location_csv, header=0, quotechar='"')


for country in data : 
    location_country = locs[locs['country'] == country['alpha-2']]
    country['latitude'] = location_country['latitude'].as_matrix()[0]
    country['longitude'] = location_country['longitude'].as_matrix()[0]
    
    
with open(location_json + 'enriched.json', 'w') as outfile:
    json.dump(data, outfile)