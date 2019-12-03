const $ = (selector) => document.querySelector(selector);

async function draw() {
  const filter = document.querySelector('input').value;
  const res = await fetch('https://wustsding.de:8080/dhv/');
  offers = await res.json();
  filtered = offers.filter(offer =>
    offer.title.includes(filter)
    && offer.date >= Date.parse($('#from').value)
    && offer.date <= Date.parse($('#to').value)
  );

  const yourVlSpec = {
    $schema: 'https://vega.github.io/schema/vega-lite/v2.0.json',
    width: 'container',
    data: { values: filtered },
    mark: { type: 'bar' },
    encoding: {
      x: { field: 'date', type: 'temporal' },
      y: { field: 'price', type: 'quantitative' },
      tooltip: [
        { field: 'title', type: 'nominal' },
        { field: 'date', type: 'temporal' },
        { field: 'price', type: 'quantitative' }
      ],
    }
  };

  vegaEmbed('#vis', yourVlSpec, {
    actions: false
  }).then(({ spec, view }) => {
    view.addEventListener('click', (event, item) => {
      $('iframe').src = item.datum.link
    })
  });
};

draw();

$('#to').value = moment().add(1, 'd').format('YYYY-MM-DD');
$('#from').value = moment().subtract(1, 'y').format('YYYY-MM-DD');

$('form').addEventListener('submit', (e) => {
  e.preventDefault();
  draw();
