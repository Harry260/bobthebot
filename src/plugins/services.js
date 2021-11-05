const services = {
  getNews: function (type = "world") {
    const availableTypes = [
      "all",
      "national",
      "business",
      "sports",
      "world",
      "politics",
      "technology",
      "startup",
      "entertainment",
      "miscellaneous",
      "hatke",
      "science",
      "automobile",
    ];
    if (!availableTypes.includes(type)) {
      return "Invalid news type!";
    }

    var endpoint = `https://shorts-api.vercel.app/news?category=${type}`;
    return fetch(endpoint)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        var length = data.data.length - 1,
          randomArticle = getRandomNumber(1, length),
          obj = data.data[randomArticle];

        var articleData = {
          message: obj.content,
          link: obj.readMoreUrl,
          image: obj.imageUrl,
          title: obj.title,
        };

        return articleData;
      })
      .catch(function (error) {
        return error;
      });
  },
  getDog: function () {
    var endpoint = `https://dog.ceo/api/breeds/image/random`;
    return fetch(endpoint)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return { 
            image: data.message, 
        };

      });
  },
  getCat: function () {
    var endpoint = `https://api.thecatapi.com/v1/images/search`;
    return fetch(endpoint)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return {
          image: data[0].url,
        };
      });
  },
  getJoke: function () {
    var endpoint = `https://v2.jokeapi.dev/joke/Miscellaneous,Dark,Pun,Spooky?blacklistFlags=nsfw,political,racist,sexist,explicit&type=twopart`;
    return fetch(endpoint)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return {
          title: data.setup,
          message: data.delivery,
        };
      });
  },
  getFact: function () {
    var endpoint = `https://uselessfacts.jsph.pl//random.json?language=en`;
    return fetch(endpoint)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        return {
          title: data.text,
          message: "This may be useless lol"
        };
      });
  }
};

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
