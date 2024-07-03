const ContractAbi: any = [
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: 'address',
            name: 'previousAdmin',
            type: 'address',
         },
         {
            indexed: false,
            internalType: 'address',
            name: 'newAdmin',
            type: 'address',
         },
      ],
      name: 'AdminChanged',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: 'address',
            name: 'beacon',
            type: 'address',
         },
      ],
      name: 'BeaconUpgraded',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: 'uint8',
            name: 'version',
            type: 'uint8',
         },
      ],
      name: 'Initialized',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: true,
            internalType: 'address',
            name: 'implementation',
            type: 'address',
         },
      ],
      name: 'Upgraded',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            indexed: false,
            internalType: 'address',
            name: 'user_address',
            type: 'address',
         },
         {
            indexed: false,
            internalType: 'uint256',
            name: 'amount_claimed',
            type: 'uint256',
         },
         {
            indexed: false,
            internalType: 'uint256',
            name: 'user_created_event_reward',
            type: 'uint256',
         },
      ],
      name: 'claimed_reward_info',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: 'uint256',
            name: 'event_creation_fee',
            type: 'uint256',
         },
      ],
      name: 'event_creation_fee_info',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            indexed: false,
            internalType: 'address',
            name: 'event_creator',
            type: 'address',
         },
         {
            indexed: false,
            internalType: 'uint256',
            name: 'event_creation_time',
            type: 'uint256',
         },
         {
            indexed: false,
            internalType: 'uint256',
            name: 'event_expiration_time',
            type: 'uint256',
         },
         {
            indexed: false,
            internalType: 'uint256',
            name: 'bet_closure_time',
            type: 'uint256',
         },
      ],
      name: 'event_info',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            indexed: false,
            internalType: 'string',
            name: 'result',
            type: 'string',
         },
      ],
      name: 'event_result_info',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            indexed: false,
            internalType: 'address',
            name: 'user_address',
            type: 'address',
         },
         {
            indexed: false,
            internalType: 'uint256',
            name: 'new_bet_closure_time',
            type: 'uint256',
         },
      ],
      name: 'new_bet_closure_time_info',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            indexed: false,
            internalType: 'address',
            name: 'user_address',
            type: 'address',
         },
         {
            indexed: false,
            internalType: 'uint256',
            name: 'new_event_expiration_time',
            type: 'uint256',
         },
         {
            indexed: false,
            internalType: 'uint256',
            name: 'new_bet_closure_time',
            type: 'uint256',
         },
      ],
      name: 'new_event_expiration_time_info',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: 'uint256',
            name: 'platform_fee',
            type: 'uint256',
         },
      ],
      name: 'platform_fee_info',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            indexed: false,
            internalType: 'address',
            name: 'user_address',
            type: 'address',
         },
         {
            indexed: false,
            internalType: 'string',
            name: 'betting_response',
            type: 'string',
         },
         {
            indexed: false,
            internalType: 'uint256',
            name: 'betting_amount',
            type: 'uint256',
         },
      ],
      name: 'response_info',
      type: 'event',
   },
   {
      anonymous: false,
      inputs: [
         {
            indexed: false,
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            indexed: false,
            internalType: 'address',
            name: 'user_address',
            type: 'address',
         },
         {
            indexed: false,
            internalType: 'uint256',
            name: 'withdraw_amount',
            type: 'uint256',
         },
         {
            indexed: false,
            internalType: 'uint256',
            name: 'user_created_event_reward',
            type: 'uint256',
         },
      ],
      name: 'withdraw_info',
      type: 'event',
   },
   {
      stateMutability: 'payable',
      type: 'fallback',
   },
   {
      inputs: [
         {
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            internalType: 'string',
            name: 'betting_response',
            type: 'string',
         },
         {
            internalType: 'uint256',
            name: 'betting_amount',
            type: 'uint256',
         },
      ],
      name: 'bet_event',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
      ],
      name: 'claim_reward_event',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
      ],
      name: 'current_odds_event',
      outputs: [
         {
            internalType: 'uint256[]',
            name: '',
            type: 'uint256[]',
         },
      ],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            internalType: 'uint256',
            name: 'new_bet_closure_time',
            type: 'uint256',
         },
      ],
      name: 'edit_bet_closure_time_event',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            internalType: 'uint256',
            name: 'new_event_expiration_time',
            type: 'uint256',
         },
      ],
      name: 'edit_expiration_time_event',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [],
      name: 'get_admin_total_reward',
      outputs: [
         {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
         },
      ],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [],
      name: 'get_creation_fee_event',
      outputs: [
         {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
         },
      ],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [],
      name: 'get_platform_fee',
      outputs: [
         {
            internalType: 'uint256',
            name: '',
            type: 'uint256',
         },
      ],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'address',
            name: '_admin',
            type: 'address',
         },
      ],
      name: 'initialize',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [],
      name: 'proxiableUUID',
      outputs: [
         {
            internalType: 'bytes32',
            name: '',
            type: 'bytes32',
         },
      ],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [],
      name: 'read_admin_address',
      outputs: [
         {
            internalType: 'address',
            name: '',
            type: 'address',
         },
      ],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
      ],
      name: 'read_event',
      outputs: [
         {
            components: [
               {
                  internalType: 'string',
                  name: 'event_id',
                  type: 'string',
               },
               {
                  internalType: 'address',
                  name: 'event_creator',
                  type: 'address',
               },
               {
                  internalType: 'uint256',
                  name: 'event_creation_time',
                  type: 'uint256',
               },
               {
                  internalType: 'uint256',
                  name: 'event_expiration_time',
                  type: 'uint256',
               },
               {
                  internalType: 'uint256',
                  name: 'bet_closure_time',
                  type: 'uint256',
               },
            ],
            internalType: 'struct AlephForesight.Event_Storage',
            name: '',
            type: 'tuple',
         },
      ],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
      ],
      name: 'read_pool_amount_event',
      outputs: [
         {
            internalType: 'uint256[]',
            name: '',
            type: 'uint256[]',
         },
      ],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            internalType: 'address',
            name: 'user_address',
            type: 'address',
         },
      ],
      name: 'read_response_event',
      outputs: [
         {
            internalType: 'uint256[]',
            name: '',
            type: 'uint256[]',
         },
      ],
      stateMutability: 'view',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            internalType: 'uint256',
            name: 'event_expiration_time',
            type: 'uint256',
         },
      ],
      name: 'register_event',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'uint256',
            name: '_event_creation_fee',
            type: 'uint256',
         },
      ],
      name: 'set_creation_fee_event',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'uint256',
            name: '_platfrom_fee',
            type: 'uint256',
         },
      ],
      name: 'set_platform_fee',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
         {
            internalType: 'string',
            name: 'result',
            type: 'string',
         },
      ],
      name: 'set_result_event',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'address',
            name: 'newImplementation',
            type: 'address',
         },
      ],
      name: 'upgradeTo',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'address',
            name: 'newImplementation',
            type: 'address',
         },
         {
            internalType: 'bytes',
            name: 'data',
            type: 'bytes',
         },
      ],
      name: 'upgradeToAndCall',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
   },
   {
      inputs: [
         {
            internalType: 'string',
            name: 'event_id',
            type: 'string',
         },
      ],
      name: 'withdraw_bet_event',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function',
   },
   {
      stateMutability: 'payable',
      type: 'receive',
   },
];

export default ContractAbi;
