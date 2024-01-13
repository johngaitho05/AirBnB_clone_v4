$(document).ready(function () {
  const amenities = {};
  const states = {};
  const cities = {};
  const chosenLocations = {};

  $('.amenities > .popover > ul > li > input[type="checkbox"]').change(function () {
    if (this.checked) {
      amenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete amenities[$(this).data('id')];
    }
    const chosenAmenities = Object.values(amenities);
    if (chosenAmenities.length > 0) {
      const selected = chosenAmenities.join(', ');
      const selectedTruncated = selected.length > 50 ? selected.substring(0, 50) + '...' : selected;

      $('div.amenities > h4').text(selectedTruncated);
    } else {
      $('div.amenities > h4').html('&nbsp;');
    }
  });

  $('.locations > .popover > ul > li > input[type="checkbox"]').change(function () {
    if (this.checked) {
      states[$(this).data('id')] = $(this).data('name');
      chosenLocations[$(this).data('id')] = $(this).data('name');
    } else {
      delete states[$(this).data('id')];
      delete chosenLocations[$(this).data('id')];
    }
    const allChosen = Object.values(chosenLocations);

    if (allChosen.length > 0) {
      const selected = allChosen.join(', ');
      const selectedTruncated = selected.length > 50 ? selected.substring(0, 50) + '...' : selected;

      $('div.locations > h4').text(selectedTruncated);
    } else {
      $('div.locations > h4').html('&nbsp;');
    }
  });

  $('.locations > .popover > ul > li > ul > li > input[type="checkbox"]').change(function () {
    if (this.checked) {
      cities[$(this).data('id')] = $(this).data('name');
      chosenLocations[$(this).data('id')] = $(this).data('name');
    } else {
      delete cities[$(this).data('id')];
      delete chosenLocations[$(this).data('id')];
    }
    const allChosen = Object.values(chosenLocations);

    if (allChosen.length > 0) {
      const selected = allChosen.join(', ');
      const selectedTruncated = selected.length > 50 ? selected.substring(0, 50) + '...' : selected;

      $('div.locations > h4').text(selectedTruncated);
    } else {
      $('div.locations > h4').html('&nbsp;');
    }
  });

  $.get('http://0.0.0.0:5001/api/v1/status/', function (data) {
    if (data?.status === 'OK') {
      $('#api_status').addClass('available');
    } else {
      $('#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    data: JSON.stringify({}),
    contentType: 'application/json',
    success: function (data) {
      let content = '';
      $.each(data, function (index, place) {
        content += `<article>
                <div class="title_box">
                    <h2>${place.name}</h2>
                    <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                    <div class="max_guest">${place.max_guest} ${place.max_guest === 1 ? 'Guest' : 'Guests'}</div>
                    <div class="number_rooms">${place.number_rooms} ${place.number_rooms === 1 ? 'Bedroom' : 'Bedrooms'}</div>
                    <div class="number_bathrooms">${place.number_bathrooms} ${place.number_bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</div>
                </div>
                <div class="description">
                    ${place.description}
                </div>
                <div class="reviews">
                    <h2 class="article_subtitle">Reviews 
                    <span class="reviews-toggle" data-place-id="${place.id}">show</span>
                    </h2>
                    <ul class="reviews-list">
                    </ul>
                </div>
            </article>`;
      });
      $('section.places').html(content);
      $('.reviews-toggle').click(onToggleReviews);
    },
    dataType: 'json'
  });

  $('button').click(function () {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({
        amenities: Object.keys(amenities),
        states: Object.keys(states),
        cities: Object.keys(cities)
      }),
      contentType: 'application/json',
      success: function (data) {
        let content = '';
        $.each(data, function (index, place) {
          content += `<article>
                <div class="title_box">
                    <h2>${place.name}</h2>
                    <div class="price_by_night">$${place.price_by_night}</div>
                </div>
                <div class="information">
                    <div class="max_guest">${place.max_guest} ${place.max_guest === 1 ? 'Guest' : 'Guests'}</div>
                    <div class="number_rooms">${place.number_rooms} ${place.number_rooms === 1 ? 'Bedroom' : 'Bedrooms'}</div>
                    <div class="number_bathrooms">${place.number_bathrooms} ${place.number_bathrooms === 1 ? 'Bathroom' : 'Bathrooms'}</div>
                </div>
                <div class="description">
                    ${place.description}
                </div>
                <div class="reviews">
                    <h2 class="article_subtitle">Reviews 
                    <span class="reviews-toggle" data-place-id="${place.id}">show</span>
                    </h2>
                    <ul class="reviews-list">
                    </ul>
                </div>
            </article>`;
        });
        $('section.places').html(content);
        $('.reviews-toggle').click(onToggleReviews);
      },
      dataType: 'json'
    });
  });

  function formatDate (dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const dayWithSuffix = day + (day % 10 === 1 && day !== 11 ? 'st' : (day % 10 === 2 && day !== 12 ? 'nd' : (day % 10 === 3 && day !== 13 ? 'rd' : 'th')));

    return dayWithSuffix + ' ' + month + ' ' + year;
  }

  function onToggleReviews () {
    const $el = $(this);
    const placeId = $el.data('place-id');
    const container = $el.parent().parent().find('.reviews-list');
    if ($el.hasClass('show')) {
      container.html('');
      $el.text('show');
    } else {
      $.get('http://0.0.0.0:5001/api/v1/places/' + placeId + '/reviews', function (data) {
        if (!data.length) {
          container.html('<p>No reviews found!</p>');
        }
        $.each(data, function (index, review) {
          $.get(`http://0.0.0.0:5001/api/v1/users/${review.user_id}`, function (user) {
            container.append(`<li>
                          <div class="review_item">
                            <h3>From ${user.first_name} ${user.last_name} the ${formatDate(review.created_at)}</h3>
                            <p class="review_text">${review.text}</p>
                          </div>
                        </li>`);
          });
        });
      });
      $el.text('hide');
    }
    $el.toggleClass('show');
  }
});
