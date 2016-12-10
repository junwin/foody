describe("Foody", function() {
  var foodyApp = require('../../../app');
  
  beforeEach(function() {
    
  });

  it("find the next word in some string", function() {
    var word = foodyApp.getNextWord("d:12/25/2016 blah");
    expect(word).toEqual("d:12/25/2016");
  });

   it("find the next word ended with a comma in some string", function() {
    var word = foodyApp.getNextWord("d:12/25,/2016 blah");
    expect(word).toEqual("d:12/25");
  });

   it("should be able find a food date string", function() {
    var kvp = foodyApp.getNextKVP("blah blah d:12/25/2016 blah");
    expect(kvp.value).toEqual("12/25/2016");
  });

  it("should be able find a food date in mm/dd/yyyy form", function() {
    var foodDate = foodyApp.getFoodDate("blah blah d:12/25/2016 blah");
    expect(foodDate.getUTCDate()).toEqual(new Date("12/25/2016").getUTCDate());
  });

  it("should be able find a food date in m/dd/yy form", function() {
    var foodDate = foodyApp.getFoodDate("blah blah d:5/25/16 blah");
    expect(foodDate.getUTCDate()).toEqual(new Date("5/25/16").getUTCDate());
  });
  
});
