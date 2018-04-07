import * as d3 from "d3"
// graph function
const makeGraph = data => {
  const w = 1280,
    h = 720,
    radius = 8,
    linkDistance = 30;
  const div = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  const svg = d3
    .select(".svg-container")
    .append("svg")
    .attr("width", w)
    .attr("height", h);
  const simulation = d3
    .forceSimulation()
    .force(
      "link",
      d3
        .forceLink()
        .id(function (d) {
          return d.index;
        })
        .distance(linkDistance)
    )
    .force("charge", d3.forceManyBody().distanceMax(150))
    .force("center", d3.forceCenter(w / 2, h / 2));
  const link = svg
    .append("g")
    .attr("class", "links")
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line");
  const node = d3
    .select(".svg-container")
    .select(".flag-container")
    .selectAll(".node")
    .data(data.nodes)
    .enter()
    .append("img")
    .attr("class", d => "flag flag-" + d.code)
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
  // add mouse tooltip
  d3
    .selectAll("img")
    .data(data.nodes)
    .on("mouseover", function (d) {
      div
        .style("opacity", 1);
      div
        .html(d.country)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY - 28 + "px");
    })
    .on("mouseout", function (d) {
      div
        .style("opacity", 0);
    })

  simulation.nodes(data.nodes).on("tick", ticked);

  simulation.force("link").links(data.links);

  function ticked() {
    link
      .attr("x1", d => d.source.x)
      .attr("x2", d => d.target.x)
      .attr("y1", d => d.source.y)
      .attr("y2", d => d.target.y);

    node
      .style(
        "left",
        d => Math.max(radius, Math.min(w - radius, d.x)) - 8 + "px"
      )
      .style(
        "top",
        d => Math.max(radius, Math.min(h - radius, d.y)) - 5 + "px"
      );
  }
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
};

// response status
const status = response => {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
};
// json response
const json = response => {
  return response.json();
};

export { status, json, makeGraph }