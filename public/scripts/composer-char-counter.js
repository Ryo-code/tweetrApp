$( document ).ready(function() {
  // Handler for .ready() called.
  console.log("The page has fully loaded!");

  $('textarea').keypress(function() {
    var maxChars = 140;
    var length = $(this).val().length;
    length = maxChars - length;

    $('form span').text(length);
    console.log("length: ", length);
    if(length < 0){
      $('form span').addClass("tooManyChars");
    }else{
      $('form span').removeClass("tooManyChars");
    }
  });

});
