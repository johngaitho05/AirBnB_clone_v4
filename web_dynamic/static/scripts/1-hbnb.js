$(document).ready(function () {
  const amenities = {};
  $('input[type="checkbox"]').change(function () {
    if (this.checked) {
      amenities[$(this).data('id')] = $(this).data('name');
    } else {
      delete amenities[$(this).data('id')];
    }
    const chosenAmenities = Object.values(amenities);
    if (chosenAmenities.length > 0) {
      const selected = Object.values(amenities).join(', ');
      const selectedTruncated = selected.length > 50 ? selected.substring(0, 50) + '...' : selected;
      $('div.amenities > h4').text(selectedTruncated);
    } else {
      $('div.amenities > h4').html('&nbsp;');
    }
  });
});
