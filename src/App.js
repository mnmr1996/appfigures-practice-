import React, { Component } from "react";
import Review from "./Review";
import "./App.css";
import Countbucket from "./Countbucket";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      userReviews: [],
      search: "",
      limit: 25,
      select: 6,
      rating: 0,
      monthToString: {
        1: "January",
        2: "Febuary",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "Septempber",
        10: "October",
        11: "November",
        12: "December"
      }
    };
  }

  // loads all the data from the API
  //I took out the url name because of making it public on github but in the fetch is where it would be placed
  componentDidMount() {
    fetch("")
      .then(res => res.json())
      .then(json => {
        this.setState({
          isLoaded: true,
          userReviews: json.reviews.sort((a, b) => a.date > b.date)
        });
      });
  }

  //loads more
  loadmore = () => {
    if (this.state.limit < this.state.userReviews.length) {
      this.setState({
        limit: this.state.limit + 25
      });
    } else {
      this.setState({
        limit: this.state.userReviews.length
      });
    }
  };

  //sets rating to what is selected in the form and resets limit to 25
  rating = event => {
    this.setState({
      rating: event.target.value,
      limit: 25
    });
  };

  render() {
    var { isLoaded, userReviews, rating, monthToString } = this.state;

    if (!isLoaded) {
      //if it's either loading the data or can't load the data this page appears
      return (
        <div className="App">
          <h1>Welcome</h1>
          <h2>Loading Data</h2>
          <img
            src="https://media.giphy.com/media/WiIuC6fAOoXD2/giphy.gif"
            className="App-logo"
            alt="logo"
          />
        </div>
      );
    } else {
      //gets todays date (month, year, and day)
      let today = new Date();
      let todayDate = today.getDate();
      let todayMonth = today.getMonth() + 1;
      let todayYear = today.getFullYear();

      //gets the bucket for the week

      let Monday;

      const Mondaycal = () => {
        if (todayDate >= 7) {
          Monday = todayDate - today.getUTCDay() + 1;
        } else {
          let temp = daysInMonth(todayMonth - 1, todayYear);
          let tempholder = 7 - todayDate;
          Monday = temp - tempholder;
        }
      };

      let prevMonday;
      //gets the bucket for the prior week
      let prevMondayCal = () => {
        if (Monday >= 7) {
          prevMonday = Monday - 7;
        } else {
          let temp = daysInMonth(todayMonth - 1, todayYear);
          let tempholder = 7 - Monday;
          prevMonday = temp - tempholder;
        }
      };

      let prevSunday;

      let prevSundaycal = () => {
        if (Monday > 1) {
          prevSunday = Monday - 1;
        } else {
          let temp = daysInMonth(todayMonth - 1, todayYear);
          let tempholder = 7 - Monday;
          prevSunday = temp - tempholder;
        }
      };

      //filters by rating
      let ratingsfiler = userReviews.filter(function(review) {
        if (rating == 0) {
          return true;
        } else if (rating == 1) {
          return review.stars == "1.00";
        } else if (rating == 2) {
          return review.stars == "2.00";
        } else if (rating == 3) {
          return review.stars == "3.00";
        } else if (rating == 4) {
          return review.stars == "4.00";
        } else if (rating == 5) {
          return review.stars == "5.00";
        }
      });

      //filters the search bar
      let userReviewsFilter = ratingsfiler.filter(review => {
        return (
          review.title
            .toLocaleLowerCase()
            .indexOf(this.state.search.toLocaleLowerCase()) !== -1 ||
          review.review
            .toLocaleLowerCase()
            .indexOf(this.state.search.toLocaleLowerCase()) !== -1
        );
      });

      //gets post from today
      let todayPost = userReviewsFilter.filter(function(review) {
        let tempDate = review.date.split("-", 3);
        let lastSplit = tempDate[2].split("T");
        if (
          tempDate[0] == todayYear &&
          tempDate[1] == todayMonth &&
          lastSplit[0] == todayDate
        ) {
          return true;
        } else {
          return false;
        }
      });

      //i need to calculate the last day of last month sometimes and this lets me do it
      function daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
      }
      //gets the post from yesterday.
      let yesterdayPost = userReviewsFilter.filter(function(review) {
        let tempDate = review.date.split("-", 3);
        let lastSplit = tempDate[2].split("T");
        //most cases fall in this one. where it's not the first of the month
        if (todayDate != 1) {
          if (
            tempDate[0] == todayYear &&
            tempDate[1] == todayMonth &&
            lastSplit[0] == todayDate - 1
          ) {
            return true;
          } else {
            return false;
          }
        }
        //if it is the first of the month and it also happens to be on jan 1st then get dec 31st of prev year
        else if (todayDate == 1 && todayMonth == 1) {
          if (
            tempDate[0] == todayYear - 1 &&
            tempDate[1] == 12 &&
            lastSplit[0] == 31
          ) {
            return true;
          } else {
            return false;
          }
        }
        //when it's the first of the month on feb-dec
        else {
          let lastDayOfLastMonth = daysInMonth(todayMonth - 1, todayYear);
          if (
            tempDate[0] == todayYear &&
            tempDate[1] == todayMonth - 1 &&
            lastSplit[0] == lastDayOfLastMonth
          ) {
            return true;
          } else {
            return false;
          }
        }
      });

      //fitlers out post that are in yesterdayPost or todayPost
      let notYesterdayOrToday = userReviewsFilter.filter(function(element) {
        return (
          yesterdayPost.indexOf(element) < 0 && todayPost.indexOf(element) < 0
        );
      });

      //gets the post from this week
      let thisWeek = notYesterdayOrToday.filter(function(review) {
        let tempDate = review.date.split("-", 3);
        //lastsplit is effectively the date in the
        let lastSplit = tempDate[2].split("T");
        Mondaycal();
        if (Monday < todayDate) {
          if (
            tempDate[0] == todayYear &&
            tempDate[1] == todayMonth &&
            lastSplit[0] >= Monday &&
            lastSplit[0] <= todayDate
          ) {
            return true;
          } else {
            return false;
          }
        }
        // every month but january
        else if (todayMonth != 1) {
          if (
            tempDate[0] == todayYear &&
            ((tempDate[1] == todayMonth - 1 && lastSplit[0] >= Monday) ||
              (tempDate[1] == todayMonth && lastSplit[0] <= todayDate))
          ) {
            return false;
          } else {
            return false;
          }
        } else {
          if (
            (tempDate[0] == todayYear - 1 &&
              tempDate[1] == todayMonth - 1 &&
              lastSplit[0] >= Monday) ||
            (tempDate[0] == todayYear &&
              tempDate[1] == todayMonth &&
              lastSplit[0] <= todayDate)
          ) {
            return true;
          } else return false;
        }
      });

      //should take care of every case that's in last week. when the week isn't split into 2 months, when it's split into 2 month, and when it's split into 2 years
      let lastWeek = notYesterdayOrToday.filter(function(review) {
        prevSundaycal();
        prevMondayCal();
        let tempDate = review.date.split("-", 3);
        //lastsplit is effectively the date in the
        let lastSplit = tempDate[2].split("T");
        if (prevMonday < prevSunday) {
          if (
            tempDate[0] == todayYear &&
            tempDate[1] == todayMonth &&
            lastSplit[0] >= prevMonday &&
            lastSplit[0] <= prevSunday
          ) {
            return true;
          } else {
            return false;
          }
        }
        //every month but january
        else if (todayMonth != 1) {
          if (
            tempDate[0] == todayYear &&
            ((tempDate[1] == todayMonth - 1 && lastSplit[0] >= prevMonday) ||
              (tempDate[1] == todayMonth && lastSplit[0] <= prevSunday))
          ) {
            return true;
          } else {
            return false;
          }
        } else {
          if (
            (tempDate[0] == todayYear - 1 &&
              tempDate[1] == todayMonth - 1 &&
              lastSplit[0] >= prevMonday) ||
            (tempDate[0] == todayYear &&
              tempDate[1] == todayMonth &&
              lastSplit[0] <= prevSunday)
          ) {
            return true;
          } else return false;
        }
      });

      let notThisWeekOrLast = userReviewsFilter.filter(function(element) {
        return (
          thisWeek.indexOf(element) < 0 &&
          lastWeek.indexOf(element) < 0 &&
          todayPost.indexOf(element) < 0 &&
          yesterdayPost.indexOf(element) < 0
        );
      });

      let thisMonth = notThisWeekOrLast.filter(function(review) {
        let tempDate = review.date.split("-", 3);
        let lastSplit = tempDate[2].split("T");
        if (tempDate[0] == todayYear && tempDate[1] == todayMonth) {
          return true;
        } else return false;
      });

      let lastMonth = notThisWeekOrLast.filter(function(review) {
        let tempDate = review.date.split("-", 3);
        let lastSplit = tempDate[2].split("T");
        if (todayMonth != 1) {
          if (tempDate[0] == todayYear && tempDate[1] == todayMonth - 1) {
            return true;
          } else return false;
        } else {
          if (tempDate[0] == todayYear - 1 && tempDate[1] == 12) {
            return true;
          } else return false;
        }
      });

      let notThismonthorLast = userReviewsFilter.filter(function(element) {
        return (
          thisWeek.indexOf(element) < 0 &&
          lastWeek.indexOf(element) < 0 &&
          todayPost.indexOf(element) < 0 &&
          yesterdayPost.indexOf(element) < 0 &&
          thisMonth.indexOf(element) < 0 &&
          lastMonth.indexOf(element) < 0
        );
      });

      let monthYearArray = [];
      let skiptoindex = [];

      //sorting everything that is not in those buckets up ahead
      let notThismonthorLastsorted = notThismonthorLast.sort(function(
        review,
        review2
      ) {
        let holder = review.date.split("-", 3);
        let tempMonth = holder[1];
        let tempyear = holder[0];
        let holder2 = review2.date.split("-", 3);
        let tempMonth2 = holder2[1];
        let tempyear2 = holder2[0];
        return tempyear2 - tempyear || tempMonth2 - tempMonth;
      });
      let count = 0;
      for (var index = 0; index < notThismonthorLastsorted.length; index++) {
        let dateHolder = notThismonthorLastsorted[index].date.split("-", 3);
        if (monthYearArray.length == 0) {
          monthYearArray.push([[dateHolder[0]], [dateHolder[1]]]);
        } else if (
          dateHolder[0] == monthYearArray[index - 1][0] &&
          dateHolder[1] == monthYearArray[index - 1][1]
        ) {
          count++;
          monthYearArray.push([[dateHolder[0]], [dateHolder[1]]]);
        } else {
          monthYearArray.push([[dateHolder[0]], [dateHolder[1]]]);
          skiptoindex.push(count + 1);
          count = 0;
        }
      }
      skiptoindex.push(count + 1);

      let placeinbuckets = [];
      let monthYearTracker = [];
      let countup = 0;
      let bucket = 0;

      while (countup < notThismonthorLastsorted.length) {
        placeinbuckets.push([]);
        monthYearTracker.push([]);
        for (var j = skiptoindex[bucket]; j >= 1; j--) {
          placeinbuckets[bucket].push(notThismonthorLastsorted[countup]);
          monthYearTracker[bucket].push(monthYearArray[countup]);
          countup++;
        }

        bucket++;
      }
      //shows the total after the filtering is done
      let total = userReviewsFilter.length;

      //after finding the search results limit the amount that it can show
      let userReviewsLimitFilter = userReviewsFilter.filter(
        (x, index) => index < this.state.limit
      );

      return (
        <div className="App">
          <h1>Reviews for Twitter</h1>
          {/*takes in input and */}
          <input
            type="text"
            placeholder="search"
            onChange={e => {
              this.setState({ search: e.target.value, limit: 25 });
            }}
          />

          {/*shows the rating */}
          <label>Select by Rating</label>
          <select id="rating" value={this.state.value} onChange={this.rating}>
            <option value="0">all</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>

          <h5>Total: {total}</h5>

          {/* gets all the post from and only displays displays when it has a value */}
          {todayPost.length > 0 && (
            <Countbucket Month="Today" Year="" array={todayPost}></Countbucket>
          )}

          {yesterdayPost.length > 0 && (
            <Countbucket
              Month="Yesterday"
              Year=""
              array={yesterdayPost}
            ></Countbucket>
          )}

          {thisWeek.length > 0 && (
            <Countbucket
              Month="This Week"
              Year=""
              array={thisWeek}
            ></Countbucket>
          )}

          {lastWeek.length > 0 && (
            <Countbucket
              Month="Last Week"
              Year=""
              array={lastWeek}
            ></Countbucket>
          )}

          {thisMonth.length > 0 && (
            <Countbucket
              Month="This Month"
              Year=""
              array={thisMonth}
            ></Countbucket>
          )}

          {lastMonth.length > 0 && (
            <Countbucket
              Month="Last Month"
              Year=""
              array={lastMonth}
            ></Countbucket>
          )}

          {placeinbuckets.map(function(item, index) {
            return (
              <Countbucket
                Month={monthToString[parseInt(monthYearTracker[index][0][1])]}
                Year={monthYearTracker[index][0][0]}
                array={item}
              ></Countbucket>
            );
          })}

          <button onClick={this.loadmore}>load more</button>
        </div>
      );
    }
  }
}

export default App;
