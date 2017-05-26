$(() => {
  $("#type").on("change", function() {
    if (this.value === "gato") {
      $(".choose").removeClass("ap-dog-2");
      $(".choose").addClass("ap-cat-6");
    } else {
      $(".choose").removeClass("ap-cat-6");
      $(".choose").addClass("ap-dog-2");
    }
  });
});
