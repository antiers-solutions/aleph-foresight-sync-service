// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract AlephForesight is UUPSUpgradeable {
    
    address private admin;
    uint private platform_fee;
    bool private initialized;      
    uint private event_creation_fee;
    uint private admin_reward;
    bool private locked; 

    struct Event_Storage {
        string event_id;
        address event_creator;
        uint event_creation_time;
        uint event_expiration_time;
        uint bet_closure_time;
        uint _platform_fee;
        uint _event_creation_fee; 
    }

    event event_info(
        string event_id,
        address event_creator,
        uint event_creation_time,
        uint event_expiration_time,
        uint bet_closure_time
    );

    event response_info(
        string event_id,
        address user_address,
        string betting_response,
        uint updated_betting_amount,
        uint betting_amount
    );

    event withdraw_info(
        string event_id,
        address user_address,
        uint withdraw_amount
    );

    event platform_fee_info(
        uint platform_fee
    );

    event event_creation_fee_info(
        uint event_creation_fee
    );

    event event_result_info(
        string event_id,
        string result
    );

    event claimed_reward_info(
        string event_id,
        address user_address,
        uint amount_claimed,
        uint user_created_event_reward,
        string event_result
    );

    event new_event_expiration_time_info(
        string event_id,
        address user_address,
        uint new_event_expiration_time,
        uint new_bet_closure_time,
        uint price_level
    );

    mapping(string => Event_Storage) event_mapping;
    mapping(string => mapping(string => uint)) betting_amount_pool;
    mapping(address => mapping(string => mapping(string => uint))) response_mapping;
    mapping(string => uint) event_creation_fees;
    mapping(string => bool) event_exists;
    mapping(string => string) event_result_mapping;
    mapping(string => mapping(address => bool)) is_claimed;                             
    mapping(string => mapping(address => bool)) _hasbet;
    mapping(string => bool) _is_result_announced; 

    /** 
        * @dev Reverts if the caller is not admin's wallet address.
    */ 
    modifier isAdmin() { 
        require(msg.sender == admin, "Caller is not Admin"); 
        _; 
    }

    /** 
        * @dev Reverts if Reentrancy occures.
    */ 
    modifier withMutex() {  
        require(!locked, "Mutex: Locked!");
        locked = true;
        _;
        locked = false;
    }

    /**
        * @dev To initalize the Aleph Foresight contract setting the admin's wallet address.
        * @param _admin, admin's wallet address.
    */ 
    function initialize(address _admin) external {  
        require(!initialized, "Contract instance has already been initialized");
        initialized = true;
        platform_fee = 500;
        event_creation_fee = 500;
        admin = _admin;
    }

    /**
        * @dev Register's the new event either by user/Admin.
        * @param event_id of the new event.
        * @param event_expiration_time of the new event.
    */
    function register_event(string memory event_id, uint event_expiration_time ) external { 
        
        uint ONE_DAY = 86400;
        uint ONE_YEAR = ONE_DAY * 365;
        uint event_creation_time = block.timestamp; 
        uint default_bet_closure_time = 0;

        require(!event_exists[event_id], "Event already exists");
        require(event_expiration_time >= block.timestamp + ONE_DAY && 
            event_expiration_time <= (event_creation_time + ONE_YEAR),
            "Invalid event expiration time provided"
        );

        if(event_expiration_time < event_creation_time + ONE_DAY * 2){
            default_bet_closure_time = event_expiration_time - ONE_DAY / 2;
        }
        else{
            default_bet_closure_time = event_expiration_time - ONE_DAY;
        }

        event_mapping[event_id] = Event_Storage (
            event_id,
            msg.sender,
            event_creation_time,
            event_expiration_time,
            default_bet_closure_time,
            platform_fee,
            event_creation_fee
        );

        event_exists[event_id] = true;

        emit event_info(
            event_id,
            msg.sender,
            event_creation_time,
            event_expiration_time,
            default_bet_closure_time
        );    
    }

    /** 
        * @dev To edit the event's expiration time.
        * @param event_id of the the event.
        * @param new_event_expiration_time of the event.
    */
    function edit_expiration_time_event(string memory event_id,uint new_event_expiration_time,uint new_price_level) external {

        uint TWO_HRS = 60 * 60 * 2;
        uint ONE_DAY = 86400;
        uint ONE_YEAR = ONE_DAY * 365;
        address event_creator = event_mapping[event_id].event_creator;
        uint event_creation_time = event_mapping[event_id].event_creation_time;
        uint default_bet_closure_time = 0;

        require(event_exists[event_id] , "Event does not exists");
        require(msg.sender == event_creator, "Does not have authority to edit event");
        require(new_event_expiration_time >= (event_creation_time + ONE_DAY) &&
            new_event_expiration_time <= (event_creation_time + ONE_YEAR),
            "Invalid expiration time provided"
        );
        require(block.timestamp <= (event_creation_time + TWO_HRS), "Time to edit event is passed");
        require(betting_amount_pool[event_id]["Yes"] == 0 && 
            betting_amount_pool[event_id]["No"] == 0,
            "Can not Edit"
        );

        if(new_event_expiration_time < event_creation_time + ONE_DAY * 2){
            default_bet_closure_time = new_event_expiration_time - ONE_DAY / 2;
        }
        else{
            default_bet_closure_time = new_event_expiration_time - ONE_DAY;
        }

        event_mapping[event_id].event_expiration_time = new_event_expiration_time;
        event_mapping[event_id].bet_closure_time = default_bet_closure_time;

        emit new_event_expiration_time_info (
            event_id,
            msg.sender,
            new_event_expiration_time,
            default_bet_closure_time,
            new_price_level
        );
    }

    /**
        * @dev To perform bidding on the Event.
        * @param event_id of the event.
        * @param betting_response of the user bidding on the event i.e Yes/No.
        * @param betting_amount, amount user is placing on the bet.
    */ 
    function bet_event(string memory event_id,string memory betting_response,uint betting_amount) external payable withMutex() { 

        require(event_exists[event_id], "Event does not exists");
        require(block.timestamp <= event_mapping[event_id].bet_closure_time, "Bet time expired");
        require(betting_amount >= 10**19 && betting_amount <= 5 * 10**22, "Invalid bet amount");
        require(msg.value == betting_amount, "Invalid Amount");

        if((keccak256(bytes(betting_response)) == keccak256(bytes("Yes")))){

            betting_amount_pool[event_id]["Yes"] += betting_amount;

            response_mapping[msg.sender][event_id]["Yes"] += betting_amount; 

            _hasbet[event_id][msg.sender] = true;

            emit response_info(
                event_id,
                msg.sender,
                betting_response,                                                        
                response_mapping[msg.sender][event_id]["Yes"],                                 
                betting_amount
            );
        }
        else if((keccak256(bytes(betting_response)) == keccak256(bytes("No")))){

            betting_amount_pool[event_id]["No"] += betting_amount;

            response_mapping[msg.sender][event_id]["No"] += betting_amount;

            _hasbet[event_id][msg.sender] = true;

            emit response_info(
                event_id,
                msg.sender,
                betting_response,
                response_mapping[msg.sender][event_id]["No"],
                betting_amount
            );
        }
    }

    /**
        * @dev To withdraw the bet if either of Yes or No pool is empty.
        * @param event_id of the event.
    */                                                                   
    function withdraw_bet_event(string memory event_id) external withMutex() { 

        require(event_exists[event_id], "Event does not exists");
        require(_hasbet[event_id][msg.sender], "Didn't bet");
        require(betting_amount_pool[event_id]["Yes"] == 0 || 
            betting_amount_pool[event_id]["No"] == 0,
            "Cannot withdraw"
        );

        uint user_bet_amount_yes = (response_mapping[msg.sender][event_id]["Yes"]);
        uint user_bet_amount_no = (response_mapping[msg.sender][event_id]["No"]);

        if(user_bet_amount_yes != 0){

            _withdraw(event_id, "Yes", user_bet_amount_yes);
        }
        else{
            _withdraw(event_id, "No", user_bet_amount_no);
        }
    }

    /**
        * @dev To set the result of the event that is expired (only admin is allowed to set the result).
        * @param event_id of the event.
        * @param result of the event.
    */  
    function set_result_event(string memory event_id,string memory result) external isAdmin() withMutex() { 

        require(event_exists[event_id], "Event does not exists");

        event_result_mapping[event_id] = result; // storing event's result
        _is_result_announced[event_id] = true;
        
        emit event_result_info(
            event_id,
            result
        );
    }

    /** 
        * @dev To claim the reward if the user won on any event.
        * @param event_id of the event.
    */  
    function claim_reward_event(string memory event_id ) external withMutex() { 

        require(event_exists[event_id], "Event does not exists");
        require(!is_claimed[event_id][msg.sender], "Already claimed reward");
        require(_hasbet[event_id][msg.sender], "Didn't bet");
        require(_is_result_announced[event_id], "Result not announced yet"); 
        require(betting_amount_pool[event_id]["Yes"] !=0 && 
            betting_amount_pool[event_id]["No"] !=0,
            "Can not Claim"
        );

        if((keccak256(bytes(event_result_mapping[event_id]))) == keccak256(bytes("Yes"))){     

            _claim(event_id,"Yes"); // payout to bidder after claiming
        }
        else{

            _claim(event_id,"No"); // payout to bidder after claiming
        }    

        is_claimed[event_id][msg.sender] = true;
    }

    /**
        * @dev To set the platfrom fee (only admin is allowed to set the platform fee).
        * @param _platfrom_fee of the platform.
    */ 
    function set_platform_fee(uint _platfrom_fee) external isAdmin() {  
        
        require(_platfrom_fee <= 5000, "Invalid platform_fee percentage provided");
        platform_fee = _platfrom_fee; 

        emit platform_fee_info(
            platform_fee
        );
    } 

    /**
        * @dev To set the event creation fee (only admin is allowed to set the event creation fee).
        * @param _event_creation_fee of the platform.
    */ 
    function set_creation_fee_event(uint _event_creation_fee) external isAdmin() { 

        require(_event_creation_fee <= 10000, "Invalid event_creation_fee percentage provided");
        event_creation_fee = _event_creation_fee;   

        emit event_creation_fee_info(
            _event_creation_fee   
        );
    } 
    

    /**
        * @dev To read any event information.
        * @param event_id of the event.
    */                                                             
    function read_event(string memory event_id) external view returns(Event_Storage memory) { // event's Information reader

        require(event_exists[event_id], "Event does not exists");
        return event_mapping[event_id];
    }

    /**
        * @dev To get the Odds of the event.
        * @param event_id of the event.
    */  
    function current_odds_event(string memory event_id) external view returns(uint[] memory) { // event's odds getter

        require(event_exists[event_id], "Event does not exists");
        
        uint event_pool_amount_true = betting_amount_pool[event_id]["Yes"];
        uint event_pool_amount_false = betting_amount_pool[event_id]["No"];
        uint event_total_pool_amount = (event_pool_amount_true + event_pool_amount_false);

        uint[] memory a = new uint[](2);

        if(betting_amount_pool[event_id]["Yes"] == 0 || betting_amount_pool[event_id]["No"] == 0) {
            a[0] = 100;
            a[1] = 100;
            return a; 
        }
        else{
            a[0] = event_total_pool_amount * 100 / event_pool_amount_true;
            a[1] = event_total_pool_amount * 100 / event_pool_amount_false;
            return a; 
        }
    }  

    /**
        * @dev To read the response of the user if he placed bet on any event.
        * @param event_id of the event.
        * @param user_address , wallet address of the user.
    */
    function read_response_event(string memory event_id,address user_address) external view returns (uint[] memory) { // Bidder Response reader

        require(event_exists[event_id], "Event does not exists");
        require(_hasbet[event_id][user_address], "User didn't bet");

        uint[] memory  a = new uint[](2);  
        a[0] = response_mapping[user_address][event_id]["Yes"];
        a[1] = response_mapping[user_address][event_id]["No"];
        
        return a;
    } 

    /**
        * @dev To get the total pool amount of any event.
        * @param event_id of the event.
    */
    function read_pool_amount_event(string memory event_id) external view returns (uint[] memory) { // event's Pool Amount reader

        require(event_exists[event_id], "Event does not exists");

        uint[] memory a = new uint[](2);

        a[0] = betting_amount_pool[event_id]["Yes"];
        a[1] = betting_amount_pool[event_id]["No"];
        
        return a;
    }

    /**
        * @dev To get the Admin's wallet address.
    */
    function read_admin_address() external view returns (address){ // Admin's address reader
        return admin;
    }

    /**
        * @dev To get the platform fee of the platform.
    */
    function get_platform_fee() external view returns (uint){ // platform_fee getter
        return platform_fee;
    }  

    /**
        * @dev To get the platform fee of any event.
    */   
    function get_platform_fee_event(string memory event_id) external view returns (uint){
        return event_mapping[event_id]._platform_fee;
    }  

    /**
        * @dev To get the event creation fee of the platform.
    */                                                                                                          
    function get_creation_fee() external view returns(uint){ // event_creation fee getter
        return event_creation_fee;
    }

    /**
        * @dev To get the total reward recieved by the admin from platform fee.
    */
    function get_admin_total_reward() external view returns(uint){ //admin's total reward getter
        return admin_reward;
    }

    /**
        * @dev Internal function to claim reward.
    */
    function _claim(string memory event_id,string memory response) internal {

        uint _platform_fee_ = event_mapping[event_id]._platform_fee;
        uint _event_creation_fee_ = event_mapping[event_id]._event_creation_fee;
        uint event_total_pool_amount = (betting_amount_pool[event_id]["Yes"] + betting_amount_pool[event_id]["No"]);
        uint user_initial_payout = (event_total_pool_amount * 10**6 / betting_amount_pool[event_id][response]) * (response_mapping[msg.sender][event_id][response]) / 10**6;
        uint admin_payout_initial = (_platform_fee_ * (user_initial_payout - (response_mapping[msg.sender][event_id][response]))) / 10000;

        if(event_mapping[event_id].event_creator != admin){
        
            admin_reward += admin_payout_initial - _event_creation_fee_ * admin_payout_initial / 10000;

            (bool successful, ) = admin.call{value:admin_payout_initial - _event_creation_fee_ * admin_payout_initial / 10000}(""); // transfers platform_fee to admin
                    require(successful, "Payment failed.");

            (bool success, ) = event_mapping[event_id].event_creator.call{value:(_event_creation_fee_ * admin_payout_initial / 10000)}(""); // transfers event_creation_fee to event_creator
                    require(success, "Payment failed.");

            (bool success_, ) = msg.sender.call{value:(user_initial_payout - admin_payout_initial)}(""); // transfers user's payout
                    require(success_, "Payment failed.");  

            emit claimed_reward_info(
                event_id,
                msg.sender,
                user_initial_payout - admin_payout_initial,
                _event_creation_fee_ * admin_payout_initial / 10000,
                event_result_mapping[event_id]
            );
        }
        else{ 

            admin_reward += admin_payout_initial;

            (bool successful, ) = admin.call{value:admin_payout_initial}(""); // transfers platform_fee to admin
                    require(successful, "Payment failed.");

            (bool success, ) = msg.sender.call{value:(user_initial_payout - admin_payout_initial)}(""); // transfers user's payout
                    require(success, "Payment failed.");  

            emit claimed_reward_info(
                event_id,
                msg.sender,
                user_initial_payout - admin_payout_initial,
                0,
                event_result_mapping[event_id]
            );
        }
    }

    /**
        * @dev Internal function to withdraw the bidding amount.
    */
    function _withdraw(string memory event_id, string memory response, uint amount) internal {

        (bool success, ) = msg.sender.call{value: amount}(""); // transfers bidding amount to user's wallet 
        require(success, "Payment failed."); 
        betting_amount_pool[event_id][response] -= response_mapping[msg.sender][event_id][response];

        response_mapping[msg.sender][event_id][response] = 0;

        emit withdraw_info(
            event_id,
            msg.sender,
            amount
        );
    }

    /**
        * @dev Internal function to upgrade the contract(accessible to admin)
    */
    function _authorizeUpgrade(address newImplementation)
        internal
        isAdmin()
        override
    {}
        
    receive() external payable {}
    fallback() external payable {}

}


