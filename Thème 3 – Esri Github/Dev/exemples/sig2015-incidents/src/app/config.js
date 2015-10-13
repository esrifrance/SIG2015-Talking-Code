define([], function() {
  return {
    // Feature Service
    citizenRequestLayerUrl: 'http://services.arcgis.com/S3Ai1AW0LHe63cdi/ArcGIS/rest/services/Request/FeatureServer/0',
    // infoTemplate for reporting.
    infoTemplate: {
              title: '<b>Rapport ${objectid}</b>',
              content: '<span class="infoTemplateContentRowLabel">Date: </span>' +
                  '<span class="infoTemplateContentRowItem">${requestdate:DateFormat}</span><br><span class="infoTemplateContentRowLabel">Téléphone: </span>' +
                  '<span class="infoTemplateContentRowItem">${phone:formatPhoneNumber}</span><br><span class="infoTemplateContentRowLabel">Nom: </span>' +
                  '<span class="infoTemplateContentRowItem">${name}</span><br><span class="infoTemplateContentRowLabel">Criticité: </span>' +
                  '<span class="infoTemplateContentRowItem">${severity:severityDomainLookup}</span><br><span class="infoTemplateContentRowLabel">Type: </span>' +
                  '<span class="infoTemplateContentRowItem">${requesttype:requestTypeDomainLookup}</span><br><span class="infoTemplateContentRowLabel">Commentaires: </span>' +
                  '<span class="infoTemplateContentRowItem">${comment}</span>'
              },
    //Severity Field Domain Value Dictionary
    severityFieldDomainCodedValuesDict:
             {
              '0': 'Incident mineur',
              '1': 'Incident majeur',
              '2': 'Incident critique'
             },
    //Request Type Domain Code Value Dictionary
    requestTypeFieldDomainCodedValuesDict:
             {
              '0': 'Véhicule abandonné',
              '1': 'Animal errant',
              '2': 'Infraction de la route',
              '3': 'Innondation',
              '4': 'Graffiti',
              '5': 'Sans-abris',
              '6': 'Décharge illégale',
              '7': 'Stationnement interdit',
              '8': 'Plante/Arbre dangereux',
              '9': 'Nid de poule',
              '10': 'Danger sur chaussée',
              '11': 'Danger sur trottoir',
              '12': 'Feu tricolor défaillant',
              '13': 'Panneau signalétique',
              '14': 'Immondice',
              '15': 'Fuite d\'eau',
              '16': 'Déchets végéteaux'
            },
  //Map Options
    mapOptions:
          {
            basemap:'topo',
            center:[2.1301,48.80118],
            zoom:14,
            sliderPosition:null
          },
  //Geocoder Options
    geocoderOptions:
          {
            autoComplete: true,
            arcgisGeocoder: {
                placeholder: 'Adresse ou lieu'
                  },
           'class': 'geocoder'
          },
    //Legend Options
    legendOptions:
          {
          },
    //locate button options
    locateButtonOptions:
          {
          }
  };

});
