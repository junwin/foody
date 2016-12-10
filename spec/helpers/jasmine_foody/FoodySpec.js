describe("Foody", function() {
  var foodyApp = require('../../../app');
  
  beforeEach(function() {
    
  });

   it("should be able find a food date string", function() {
    var kvp = foodyApp.getNextKVP("blah blah d:12/25/2016 blah");
    expect(kvp.toEqual("12/25/2016"));
  });

  it("should be able find a food date in mm/dd/yyyy form", function() {
    var foodDate = foodyApp.getFoodDate("blah blah d=12/25/2016 blah");
    expect(foodDate.getUTCDate()).toEqual(new Date("12/25/2016").getUTCDate());
  });
  
});
