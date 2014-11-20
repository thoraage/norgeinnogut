var years = [ 2009, 2010, 2011, 2012, 2013 ];
var data = {
    inntekter: {
        'Skatt på inntekt og formue': [ 347591, 393412, 460617, 471087, 433139 ],
        'Avgifter (produksjonsskatter)': [ 276365, 296919, 308527, 322389, 337948 ],
        'Kapitalskatter': [ 2431, 2377, 1754, 1887, 2246 ],
        'Trygde og pensjonspremier': [ 234864, 244330, 261263, 278820, 292782 ],
        'Formuesinntekter': {
            'Renteinntekter': [ 86548, 81951, 83295, 75650, 80029 ],
            'Utbytte': [ 69526, 65110, 86410, 96416, 108386 ],
            'Uttak fra forretningsdrift': {
                'Uttak fra sdøe': [ 98285, 100258, 125820, 148446, 131604 ],
                'Uttak fra annen virksomhet': [ 14, 6, 12, -14, -2]
            },
            'Bompenger, leieinntekter av grunn mv': [ 7335, 4619, 4877, 7031, 8794 ]
        },
        'Gebyrinntekter': [ 21164, 23033, 23594, 24705, 25276 ],
        'Løpende overføringer': {
            'Overføringer fra offentlig forvaltning': {
                'Overføringer fra kommuneforvaltningen': [ 2269, 1474, 1262, 6848, 7285 ]
            },
            'Bøter, inndragninger mv.': [ 1732, 2152, 2015, 1978, 1938 ],
            'Andre innenlandske overføringer': [ 1808, 1731, 2013, 1909, 1618 ],
            'Overføringer fra utlandet': [ 138, 52, 7, 39, 46 ]
        }
    }
};

var nodes = _.keys(data);

/*
var sankey = d3.sankey()
    .size([width, height])
    .nodeWidth(15)
    .nodePadding(10)
    .nodes(nodes)
    .links(links)
    .layout(32);
*/