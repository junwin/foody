describe("DataService", function() {
  var DataService = require('../../../dataservice');
  var ds
 

  beforeEach(function() {
    ds = new DataService.ds("aaa");
  });

  it("should be able to connect", function() {
      ds.save("xx");
    //player.play(song);
        expect(ds.saveVal).toEqual("xx");
  });

 
 describe("dateservice crud", function() {
     /*
    beforeEach(function() {
      ds = new dataservice;
    });

    it("should be able to insert", function() {
      expect(player.isPlaying).toBeFalsy();

      // demonstrates use of 'not' with a custom matcher
      expect(player).not.toBePlaying(song);
    });
    */

  });
  
});
