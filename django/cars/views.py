from django.shortcuts import render

from django.http import HttpResponse

from cars.models import Car

from django.template import loader

from django.http import JsonResponse

from .predictor import get_models_predictions,get_aws_predictions,get_neural_network_predictions

"""DRG"""
def form(request):
    template = loader.get_template('form.html')
    context = {}
    return HttpResponse(template.render(context, request))

def prediction(request):
    obj_car = Car.load_from_resquest(request)
    json_response = {
        'prediction_models': get_models_predictions(obj_car),
        'prediction_aws': get_aws_predictions(obj_car),
        'prediction_mlp': get_neural_network_predictions(obj_car),
        'car_parameters': obj_car.to_dict_for_pd_not_price_and_id()
    }
    return JsonResponse(json_response, safe=False)
