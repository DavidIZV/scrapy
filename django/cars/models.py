import this
from django.db import models
from django.forms.models import model_to_dict

"""DRG"""
class Car(models.Model):
    km=models.IntegerField()
    make=models.IntegerField()
    transmissionType=models.IntegerField()
    year=models.IntegerField()
    price=models.IntegerField()
    seller_type=models.IntegerField()
    bodyType=models.IntegerField()
    cubicCapacity=models.IntegerField()
    hp=models.IntegerField()
    acceleration=models.IntegerField()
    length=models.IntegerField()
    width=models.IntegerField()
    
    @classmethod
    def load_from_resquest(cls, request):
        km=request.GET['km']
        make=request.GET['make']
        transmissionType=request.GET['transmissionType']
        year=request.GET['year']
        seller_type=request.GET['seller_type']
        bodyType=request.GET['bodyType']
        cubicCapacity=request.GET['cubicCapacity']
        hp=request.GET['hp']
        acceleration=request.GET['acceleration']
        length=request.GET['length']
        width=request.GET['width']
        return Car(km=km,make=make,transmissionType=transmissionType,year=year,seller_type=seller_type,bodyType=bodyType,
                   cubicCapacity=cubicCapacity,hp=hp,acceleration=acceleration,length=length,width=width)

    def django_model_to_list_value(obj_car):
        return [ obj_car.km,obj_car.make,obj_car.transmissionType,obj_car.year,
                obj_car.seller_type,obj_car.bodyType,obj_car.cubicCapacity,
                obj_car.hp,obj_car.acceleration,obj_car.length,obj_car.width ]

    def to_dict(this):
        return model_to_dict(this)

    def to_csv(this):
        csv_str = ''
        for key,value in model_to_dict(this).items():
            if key != 'id' and key != 'price':
                csv_str = csv_str + str(value) + ','
        return csv_str[0:len(csv_str)-1]

    def to_dict_for_pd_not_price_and_id(this):
        result=model_to_dict(this)
        result.pop('id')
        result.pop('price')
        for key in result.keys():
            result[key]=[result[key]]
        return result
