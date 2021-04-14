function init(){
    var dropdown=d3.select("#selDataset")
    d3.json("samples.json").then((sampleData)=>{
        var names = sampleData.names;
        console.log (names);
        names.forEach((sample)=>{
            dropdown.append("option")
            .text(sample)
            .property("value", sample);

        })

        var firstSample = names[0];
        demo(firstSample);
        charts(firstSample);


    })

}

init()


function demo(sample){
    d3.json("samples.json").then((sampleData)=>{
        var metaData = sampleData.metadata;
        var filterData = metaData.filter(row=>row.id == sample);
        var result = filterData[0];
        var display = d3.select("#sample-metadata");
        display.html("");
        Object.entries(result).forEach(([key, value])=>{
            display.append("h6").text(`${key} : ${value}`);
        })


    })


}

function charts (sample){
    d3.json("samples.json").then((sampleData)=>{
        var samplesdata = sampleData.samples;
        var filterData = samplesdata.filter(row=>row.id == sample);
        var result = filterData[0];

        var otuid = result.otu_ids;
        var otulabels = result.otu_labels;
        var samplevalues = result.sample_values;
        var bubbledata = [{
            x:otuid,
            y:samplevalues,
            text:otulabels,
            mode:"markers",
            marker:{
                size:samplevalues,
                color:otuid,
                colorscale:"Earth"
            },

        }]

        var layout = {
            xaxis:{title: "OTU ID"},
            height: 600,
            width: 1300
        };

    
        Plotly.newPlot("bubble", bubbledata, layout);

        var bardata = [
            {
            x: samplevalues.slice(0, 10).reverse(),
            y: otuid.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: otulabels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h",

        }];

        var layout = {
            title: "Top 10 OTU",
            margin: { t: 30, l: 150 }
};



        Plotly.newPlot("bar", bardata, layout);

    });
}

function optionChanged(nextsample){
    demo(nextsample)
    charts(nextsample)
}