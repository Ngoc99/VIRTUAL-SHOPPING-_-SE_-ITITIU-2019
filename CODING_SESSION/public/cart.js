$(document).ready(() => {
  $('#addToCart').click(() => {
    $.ajax({
      url: '/productInfo/:id',
      type: 'POST',
      data: query,
      dataType: 'application/json; charset=utf-8',
      success: (data) => {
        alert(data);
        $('#cart').ejs('2');
        // for (var x = 0; x < data.length; x++) {
        //     content = data[x].Id;
        //     content += "<br>";
        //     content += data[x].Name;
        //     content += "<br>";
        //     $(content).appendTo("#ProductList");
        //    // updateListing(data[x]);
        // }
      }
    })
  })
})