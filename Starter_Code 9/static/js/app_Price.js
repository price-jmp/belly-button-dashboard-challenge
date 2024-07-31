// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    
    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let metadata_info = metadata.filter(x => x.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`
    let metadata_panel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    metadata_panel.html("");

    // Inside for a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.
    for (const [key, value] of Object.entries(metadata_info)){
      metadata_panel.append("h6").text(`${key}: ${value}`);
    }
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let sample_data = data.samples;

    // Filter the samples for the object with the desired sample number
    let info = sample_data.filter(x => x.id === sample)[0];

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = info.otu_ids;
    let otu_labels = info.otu_labels;
    let sample_values = info.sample_values;
    

    /////////////////// BUBBLE CHART /////////////////// 
    // Build a Bubble Chart
    let bubbleTrace1 = {
      x: otu_ids, 
      y: sample_values,
      mode: "markers",
      marker: {
        color: otu_ids,
        opacity: .7,
        size: sample_values,
        colorscale: "Jet"
      },
      text: otu_labels
    };

    // Render the Bubble Chart
    let bubbleTraces = [bubbleTrace1];

    // Add title and axis labels to the chart
    let layout = {
      title: "Bacteria Cultures Per Sample", 
      showlegend: false,
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Number of Bacteria"}
    };

    // Render plot to div tag with id "bubble"
    Plotly.newPlot("bubble", bubbleTraces, layout);


    /////////////////// BAR CHART /////////////////// 
    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let bar_y = otu_ids.map(x => `OTU: ${x}`);

    // Build a Horizontal Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barTrace1 = {
      x: sample_values.slice(0, 10).reverse(), 
      y: bar_y.slice(0, 10).reverse(), 
      type: "bar",
      marker: {
        color: "#00b4d8",
        opacity: .7,
      },
      text: otu_labels.slice(0, 10).reverse(),
      name: "attempt",
      orientation: "h"
    };

    // Render the Bar Chart
    let barTraces = [barTrace1];

    // Add title and x-axis label to the chart
    let layout2 = {
      title: "Top 10 Bacteria Cultures Found", 
      xaxis: {title: "Number of Bacteria"}
    };

    //Render the plot to div tag with id "bar"
    Plotly.newPlot("bar", barTraces, layout2);
  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field to populate the dropdown
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++){
      let name = names[i];
      dropdown.append("option").text(name);
    }

    // Get the first sample from the list
    let default_name = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(default_name);
    buildMetadata(default_name);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
