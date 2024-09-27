const { expect } = require("chai");
const { ethers, upgrades} = require("hardhat");

describe("AlephContract", function () {
  let AlephContract;
  let alephcontract;
  let admin;
  let addr1;

  beforeEach(async function () {
    AlephContract = await ethers.getContractFactory("AlephForesight");
    [admin, addr1] = await ethers.getSigners();

    alephcontract = await upgrades.deployProxy(AlephContract,[admin.address],{
      initializer:"initialize",
     });
  });

  describe("Initialization", async function () {
    it("Should set the correct platform_fee ", async function () {
      expect(await alephcontract.get_platform_fee()).to.equal(500);
    });

    it("Should set the correct event_creation_fee", async function () {
      expect(await alephcontract.get_creation_fee()).to.equal(500);
    });

    it("Should set the correct admin address", async function () {
      expect(await alephcontract.read_admin_address()).to.equal(admin.address);
    });

  });
  describe("Event Registration", function () {
    it("Should register a new event", async function () {
      const eventId = "event1";
      const eventExpirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      await alephcontract.register_event(eventId, eventExpirationTime);

      const event = await alephcontract.read_event(eventId);
      expect(event.event_id).to.equal(eventId);
      expect(event.event_creation_time).to.be.gt(0);
      expect(event.event_expiration_time).to.equal(eventExpirationTime);
    });

    it("Should not register the same event twice", async function () {
      const eventId = "event2";
      const eventExpirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      await alephcontract.register_event(eventId, eventExpirationTime);
      await expect(alephcontract.register_event(eventId, eventExpirationTime)).to.be.revertedWith("Event already exists");
    });
  });

  describe("Edit Event Expiration Time", function () {
    it("Should edit the event's expiration time", async function () {
      const eventId = "event3";
      const eventExpirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const newEventExpirationTime = eventExpirationTime + 3600; // 1 more hour

      await alephcontract.register_event(eventId, eventExpirationTime);

      await alephcontract.edit_expiration_time_event(eventId, newEventExpirationTime, 100);

      const event = await alephcontract.read_event(eventId);
      expect(event.event_expiration_time).to.equal(newEventExpirationTime);
    });

    it("Should not allow non-creator to edit event", async function () {
      const eventId = "event4";
      const eventExpirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const newEventExpirationTime = eventExpirationTime + 3600; // 1 more hour

      await alephcontract.register_event(eventId, eventExpirationTime);

      await expect(alephcontract.connect(addr1).edit_expiration_time_event(eventId, newEventExpirationTime, 100)).to.be.revertedWith("Does not have authority to edit event");
    });
  });

  describe("Betting", function () {
    it("Should place a bet on an event", async function () {
      const eventId = "event5";
      const eventExpirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
      const betAmount = 10000;

      await alephcontract.register_event(eventId, eventExpirationTime);

      await alephcontract.connect(addr1).bet_event(eventId, "Yes", { value: betAmount });

      const response = await alephcontract.read_response_event(eventId, addr1.address);
      expect(response[0]).to.equal(betAmount);
      expect(response[1]).to.equal(0);
    });

    it("Should not allow betting after bet closure time", async function () {
      const eventId = "event6";
      const eventExpirationTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now

      await alephcontract.register_event(eventId, eventExpirationTime);

      // Fast forward time
      await ethers.provider.send('evm_increaseTime', [3600 + 1]);
      await ethers.provider.send('evm_mine', []);

      await expect(alephcontract.connect(addr1).bet_event(eventId, "Yes", { value: 2000})).to.be.revertedWith("Bet time expired");
    });
  });

  describe("Withdraw Bet", function () {
    it("Should allow withdrawal if pools are empty", async function () {
      const eventId = "event7";
      const eventExpirationTime = Math.floor(Date.now() / 1000) + 36000; // 10 hour from now
      const betAmount = 1000;

      await alephcontract.register_event(eventId, eventExpirationTime);
      await alephcontract.connect(addr1).bet_event(eventId, "Yes", { value: betAmount });

      // Simulate empty pool
      await alephcontract.connect(addr1).withdraw_bet_event(eventId);

      const response = await alephcontract.read_response_event(eventId, addr1.address);
      expect(response[0]).to.equal(0);
      expect(response[1]).to.equal(0);
    });

    it("Should not allow withdrawal if pools are not empty", async function () {
      const eventId = "event8";
      const eventExpirationTime = Math.floor(Date.now() / 1000) + 36000; // 10 hour from now
      const betAmount = 1000;

      await alephcontract.register_event(eventId, eventExpirationTime);
      await alephcontract.connect(addr1).bet_event(eventId, "Yes", { value: betAmount });
      await alephcontract.connect(addr1).bet_event(eventId, "No", { value: betAmount });

      await expect(alephcontract.connect(addr1).withdraw_bet_event(eventId)).to.be.revertedWith("Cannot withdraw");
    });
  });

  describe("Set Event Result", function () {

    it("Should not allow non-admin to set event result", async function () {
      const eventId = "event10";
      const eventExpirationTime = Math.floor(Date.now() / 1000) + 36000; // 10 hour from now

      await alephcontract.register_event(eventId, eventExpirationTime);
      await expect(alephcontract.connect(addr1).set_result_event(eventId, "Yes")).to.be.revertedWith("Caller is not Admin");
    });
  });

  describe("Claim Reward", function () {
    it("Should allow users to claim rewards", async function () {
      const eventId = "event11";
      const eventExpirationTime = Math.floor(Date.now() / 1000) + 36000; // 10 hour from now
      const betAmount = 1000;

      await alephcontract.register_event(eventId, eventExpirationTime);
      await alephcontract.connect(addr1).bet_event(eventId, "Yes", { value: betAmount });
      await alephcontract.connect(addr1).bet_event(eventId, "No", { value: betAmount });

      await alephcontract.connect(admin).set_result_event(eventId, "Yes");
      await alephcontract.connect(addr1).claim_reward_event(eventId);

      // Ensure that reward is claimed and admin's total reward is updated
      const adminReward = await alephcontract.get_admin_total_reward();
      expect(adminReward).to.be.gt(0);
    });

    it("Should not allow claiming reward if result is not announced", async function () {
      const eventId = "event12";
      const eventExpirationTime = Math.floor(Date.now() / 1000) + 36000; // 10 hour from now
      const betAmount = 1000;

      await alephcontract.register_event(eventId, eventExpirationTime);
      await alephcontract.connect(addr1).bet_event(eventId, "Yes", { value: betAmount });

      await expect(alephcontract.connect(addr1).claim_reward_event(eventId)).to.be.revertedWith("Result not announced yet");
    });
  });


  describe("Set Platform Fee", function () {
    it("Should allow admin to set platform fee", async function () {
      await alephcontract.set_platform_fee(1000);
      expect(await alephcontract.get_platform_fee()).to.equal(1000);
    });

    it("Should not allow setting platform fee above 5000", async function () {
      await expect(alephcontract.set_platform_fee(6000)).to.be.revertedWith("Invalid platform_fee percentage provided");
    });
  });

  describe("Set Event Creation Fee", function () {
    it("Should allow admin to set event creation fee", async function () {
      await alephcontract.set_creation_fee_event(1000);
      expect(await alephcontract.get_creation_fee()).to.equal(1000);
    });

    it("Should not allow setting event creation fee above 10000", async function () {
      await expect(alephcontract.set_creation_fee_event(15000)).to.be.revertedWith("Invalid event_creation_fee percentage provided");
    });
  });

});