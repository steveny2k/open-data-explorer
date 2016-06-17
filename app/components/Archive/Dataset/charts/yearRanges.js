export default {
  'Last 5 Years'         : {
    startDate     : (now) => {
      return now.add(-5,'year').startOf('year')
    },
    endDate       : (now) => {
      return now;
    }
  },

  'Last 10 Years'     : {
    startDate     : (now) => {
      return now.add(-10, 'year').startOf('year');
    },
    endDate       : (now) => {
      return now;
    }
  },

  'Last 15 Years'   : {
    startDate     : (now) => {
      return now.add(-15, 'year').startOf('year');
    },
    endDate       : (now) => {
      return now;
    }
  }
}