$(() => {
  $("#color").on("change", function() {
    if (this.value === "otro") {
      $(
        `<div class="row" id="newColor">
          <div class="input-field col offset-m3 m6 s12">
            <i class="material-icons prefix">help</i>
            <input type="text" id="otherColor" name="otherColor">
            <label for="otherColor">¿Cuál color?</label>
          </div>
        </div>`
      ).insertAfter("#other-color");
    } else {
      $("#newColor").remove();
    }
  });
});
