module.exports = [
    {
        qInfo: {
            qType: 'myobj',
            qId: 'dataobject'
        },
        title: 'Amount of calories burned',
        qHyperCubeDef: {
            qDimensions: [{
                qNullSuppression: true,
                qDef: {
                    qFieldDefs: ['StartDate'],
                    qSortCriterias: [{
                        qSortByNumeric: 1,
                        qSortByLoadOrder: 1
                    }]
                }
            }],
            qMeasures: [{
                qDef: { qDef: 'Sum(calories)' }
            }],
            qInterColumnSortOrder: [0,1],
            qInitialDataFetch: [{
                qTop: 0,
                qLeft: 0,
                qWidth: 2,
                qHeight: 5000
            }]
        }
    },
    {
        qInfo: {
            qType: 'mylist',
            qId: 'listobject'
        },
        qListObjectDef: {
            qDef: {
                qFieldDefs: ['StartDate'],
                qSortCriterias: [{
                    qSortByNumeric: 1
                }]
            },
            qShowAlternatives: true,
            qInitialDataFetch: [{
                qHeight: 100,
                qWidth: 1,
                qTop: 0,
                qLeft: 0
            }]
        }
    }
    
];