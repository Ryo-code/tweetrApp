/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function() {

  var createTweetElement = (data) => {
    var today = new Date(); //  (ms > sec > hr > days)
    var diff = parseInt((today - data.created_at) / (1000 * 60 * 60 * 24));

    var tweetHTML = `
      <article>
        <header>
          <img src="${data.user.avatars.small}">
          <p class="TweeterName">${data.user.name}</p>
          <p class="TweeterHandle">${data.user.handle}</p>
        </header>

        <main>
        <p>${data.content.text}</p>
        </main>

        <footer>
          <p>${diff} day(s) ago</p>
          <span class="icons">
            <img src="http://icons.iconarchive.com/icons/paomedia/small-n-flat/256/flag-icon.png" alt="Flag">
            <img src="https://pbs.twimg.com/media/Cm9baPGWEAAKA2r.png" alt="RT Arrows">
            <img src="http://milana.ee/img/cms/Heart.png" alt="Heart">
          </span>

        </footer>
      </article>
    `;

    return tweetHTML;
  };

  // Test / driver code (temporary)
  // console.log($tweet); // to see what it looks like
  // to add it to the page so we can make sure it's got all the right elements, classes, etc.

  var $el = $('#tweets-container');

  function renderTweets(tweets) {
    tweets.forEach(function(tweet) {
      var tweetHTML = createTweetElement(tweet);
      $el.prepend(tweetHTML);
    });
    // loops through tweets
    // calls createTweetElement for each tweet
    // takes return value and appends it to the tweets container
  }

  function loadTweets() {
    $.ajax({
      url: 'http://localhost:8080/tweets',
      method: 'GET',
      success: function(result) {
        renderTweets(result);
      }
    });
  }

  $('#tweetForm').on('submit', function composeTweet(e) {
    e.preventDefault(); //prevents submitting (refreshing the page)
    var strQuery = $('#tweetForm').serialize();

    var text = $('textarea').val();
    console.log('Text: ', text, 'text length = ', text.length);

    if (text.trim() === "" || text.length > 140) {
      console.log("Fail...");
      $('main div').addClass("flash-msg-appear");

    } else {
      $('main div').removeClass("flash-msg-appear");
      console.log("Success!");
      $.ajax({
        url: 'http://localhost:8080/tweets',
        data: strQuery,
        method: 'POST',
        success: function(result) {
          console.log(result);
          $("#tweetForm")[0].reset();
          loadTweets();
        }
      });
    }
  });

  loadTweets();

  $("#compose-button").click(function() {
    console.log("Button pressed!");
    $(".new-tweet").slideToggle(function() {
      $("textarea").focus();
    });
  });
});
