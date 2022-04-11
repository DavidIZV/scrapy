"use strict";

/* DRG */
window.coches_net = {

    makes: [],
    transmissionType: [],
    seller_type: [],
    bodyType: [],

    inicialize: function () {
        coches_net.downloadValuesForFormFieldsAndLoadThem();
        coches_net.catchFormSubmit();
    },

    downloadValuesForFormFieldsAndLoadThem: function () {
        coches_net.myRequestAndDo('GET', '/static/dictionary_manual_values_traducido.json', {}, coches_net.loadDataFromDictionary);
    },

    loadDataFromDictionary: function (json) {
        console.log(json.make)
        coches_net.makes = json.make;
        coches_net.transmissionType = json.transmissionType;
        coches_net.seller_type = json.seller_type;
        coches_net.bodyType = json.bodyType;
        coches_net.loadFormFields();
    },

    loadFormFields: function () {
        Object.keys(coches_net.makes).forEach(function (key) {
            var value = coches_net.capitalizeValues(key);
            $("#make").prepend('<option value="' + coches_net.makes[key] + '">' + value + '</option>');
        });
        Object.keys(coches_net.transmissionType).forEach(function (key) {
            var value = coches_net.capitalizeValues(key);
            $("#transmissionType").prepend('<option value="' + coches_net.transmissionType[key] + '">' + value + '</option>');
        });
        Object.keys(coches_net.seller_type).forEach(function (key) {
            var value = coches_net.capitalizeValues(key);
            $("#seller_type").prepend('<option value="' + coches_net.seller_type[key] + '">' + value + '</option>');
        });
        Object.keys(coches_net.bodyType).forEach(function (key) {
            var value = coches_net.capitalizeValues(key);
            $("#bodyType").prepend('<option value="' + coches_net.bodyType[key] + '">' + value + '</option>');
        });
    },

    capitalizeValues: function (word) {
        var value = word.toString();
        value = value.toLowerCase();
        return value.charAt(0).toUpperCase() + value.substring(1);
    },

    catchFormSubmit: function () {
        $(document).on('submit', '#post-form', function (e) {
            e.preventDefault();
            coches_net.myRequestAndDo('GET', '/cars/prediction', coches_net.readFormDatas(), coches_net.renderStimation);
        });
    },

    readFormDatas: function () {
        return {
            km: $('#km').val(), make: $('#make').val(), transmissionType: $('#transmissionType').val(),
            year: $('#year').val(), seller_type: $('#seller_type').val(), bodyType: $('#bodyType').val(),
            cubicCapacity: $('#cubicCapacity').val(), hp: $('#hp').val(), acceleration: $('#acceleration').val(),
            length: $('#length').val(), width: $('#width').val(),
            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val(), action: 'get'
        }
    },

    renderStimation: function (json) {
        // document.getElementById("post-form").reset();
        var car_parameters = coches_net.createCarDataParagraph(json, 'col-md-6')
        var prediction_models = coches_net.createPredictionsDataParagraph(json.prediction_models, 'col-md-6')
        var prediction_models_neural = coches_net.createPredictionsDataParagraph(json.prediction_mlp, 'col-md-6')
        var prediction_models_aws = coches_net.createPredictionsDataParagraph(json.prediction_aws, 'col-md-6')
        $("#response").prepend(coches_net.createDataStructure(car_parameters, prediction_models, prediction_models_neural, prediction_models_aws))
    },

    createCarDataParagraph: function (json, spaceClass) {
        var car_parameters = ""
        Object.keys(json.car_parameters).forEach(function (key) {
            var value = json.car_parameters[key]
            if (key == 'make') {
                value = Object.keys(coches_net.makes).find(key => coches_net.makes[key] == value);
            }
            if (key == 'transmissionType') {
                value = Object.keys(coches_net.transmissionType).find(key => coches_net.transmissionType[key] == value);
            }
            if (key == 'seller_type') {
                value = Object.keys(coches_net.seller_type).find(key => coches_net.seller_type[key] == value);
            }
            if (key == 'bodyType') {
                value = Object.keys(coches_net.bodyType).find(key => coches_net.bodyType[key] == value);
            }
            value = coches_net.capitalizeValues(value);
            car_parameters = car_parameters + "<p class='" + spaceClass + "'>" + key + ": " + value + "</p>"
        });
        return car_parameters
    },

    createPredictionsDataParagraph: function (json, spaceClass) {
        var prediction_models = ""
        if (json != null) {
            Object.keys(json).forEach(function (key) {
                prediction_models = prediction_models + "<p class='" + spaceClass + "'>" + key + ": " + json[key] + " €</p>"
            });
        } else {
            prediction_models = "Predicciones no disponibles"
        }
        return prediction_models
    },

    createDataStructure: function (car_parameters, prediction_models, prediction_models_neural, prediction_models_aws) {
        return '<div class="col-md-6">' +
            '<a href="#" onclick="$(this).parent().remove();return false;" class="close">&times;</a>' +
            '<div class="no-gutters grey border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative p-2">' +
            '<div class="col p-4 d-flex position-static">' +
            '<div class="row">' +
            '<h4 class="mb-2 mt-3">Algoritmos de aprendizaje</h4>' +
            '<div class="ml-1 col-md-12 border row">' +
            prediction_models +
            '</div>' +
            '<h4 class="mb-2 mt-3">Algoritmos de redes neuronales</h4>' +
            '<div class="ml-1 col-md-12 border row">' +
            prediction_models_neural +
            '</div>' +
            '<h4 class="mb-2 mt-3">Algoritmos de aws</h4>' +
            '<div class="ml-1 col-md-12 border row">' +
            prediction_models_aws +
            '</div>' +
            '<h4 class="mb-2 mt-3">Datos de entrada de la prediccion</h4>' +
            '<div class="ml-1 col-md-12 border row">' +
            car_parameters +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
    },

    myRequestAndDo: function (pType, pUrl, pData, pOkeyDo) {
        $.ajax({
            type: pType,
            url: pUrl,
            data: pData,
            success: function (json) {
                pOkeyDo(json);
            },
            error: function (xhr, errmsg, err) {
                $('#error').html("<div class='alert alert-danger' data-alert>Oops! We have encountered an error: <p>"
                    + xhr.status + "</p> <a href='#' onclick='$(this).parent().remove()' class='close'>&times;</a></div>");
                console.log(xhr.status + ": " + xhr.responseText);
            }
        });
    }
}

$(document).ready(coches_net.inicialize);