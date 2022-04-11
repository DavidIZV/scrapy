"""DRG"""

from cars.models import Car
from django.forms.models import model_to_dict
from os import walk
import pickle
import os
import pandas as pd

def get_models_predictions(obj_car):
    models_names=get_models_paths('/models/learners/')
    models=get_list_loads_models(models_names)
    return predict_with_models(models, obj_car)

def get_neural_network_predictions(obj_car):
    models_names=get_models_paths('/models/neural/')
    models=get_list_loads_models(models_names)
    return predict_with_models(models, obj_car)

def get_aws_predictions(obj_car):
    return None

def get_list_loads_models(models_names):
    models=[]
    for model_name in models_names:
        with open(model_name, "rb") as file:
            models.append(pickle.load(file))
    return models

def predict_with_models(models, car_data):
    models_predictions,cont={},0
    car_dict=car_data.to_dict_for_pd_not_price_and_id()
    car_data_df=pd.DataFrame.from_dict(car_dict)
    for model in models:
        price=model.predict(car_data_df)[0]
        price,model_id=get_id_and_price_formatted(price,cont,model)
        models_predictions[model_id]=price
        cont=cont+1
    return models_predictions

def get_id_and_price_formatted(price,cont,model):
    price_formatted=str(int(round(price, 2)))
    price_formatted=price_formatted[:-3]+'.'+price_formatted[-3:]
    model_id=str(cont)+"_"+str(model.__class__.__name__)
    return price_formatted,model_id

def get_models_paths(sub_path):
    path = os.path.dirname(__file__) + sub_path
    models_paths = []
    for (dirpath, dirnames, filenames) in walk(path):
        for filename in filenames:
            relative_path = path + filename
            models_paths.append(relative_path)
        break
    return models_paths
