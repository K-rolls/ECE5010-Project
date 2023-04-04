// interface class
const Query = {
  makeQuery: function () {},
  getPage: function () {},
};

class albumQuery {
  constructor(q, decade = 0, page) {
    switch (decade) {
      case 0:
        this.decadeString = "";
        break;
      case 1:
        this.decadeString = "year:2020-2029";
        break;
      case 2:
        this.decadeString = "year:2010-2019";
        break;
      case 3:
        this.decadeString = "year:2000-2009";
        break;
      case 4:
        this.decadeString = "year:1990-1999";
        break;
      case 5:
        this.decadeString = "year:1980-1989";
        break;
      case 6:
        this.decadeString = "year:1970-1979";
        break;
      case 7:
        this.decadeString = "year:1960-1969";
        break;
      case 8:
        this.decadeString = "year:1950-1959";
        break;
      case 9:
        this.decadeString = "year:1940-1949";
        break;
      default:
        this.decadeString = "";
    }

    if (q === undefined && this.decadeString === "") {
      console.error("Bad search query");
    } else if (q === undefined && this.decadeString !== "") {
      this.q = this.decadeString;
    } else if (q !== undefined && this.decadeString !== "") {
      this.q = `${q} ${this.decadeString}`;
    } else if (q !== undefined) {
      this.q = q;
    }

    this.page = page;
    this.type = "album";
  }

  makeQuery() {
    return this.q;
  }

  getPage() {
    return this.page;
  }
}

class artistQuery {
  constructor(q) {
    this.q = q;
    this.type = "artist";
    this.page = 0;
  }

  makeQuery() {
    return this.q;
  }

  getPage() {
    return this.page;
  }
}

// assigns the values of Query to albumQuery simulating a java interface
// this is done so that we can use the strategy design pattern to implement
// other types of queries
Object.assign(albumQuery.prototype, Query);
Object.assign(artistQuery.prototype, Query);

module.exports = {
  albumQuery,
  artistQuery,
};
