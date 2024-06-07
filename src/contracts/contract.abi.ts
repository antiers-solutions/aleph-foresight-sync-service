const ContractAbi: any = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "event_creation_fee",
                type: "uint256",
            },
        ],
        name: "event_creation_fee_info",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "string",
                name: "event_id",
                type: "string",
            },
            {
                indexed: false,
                internalType: "address",
                name: "event_creator",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "event_creation_time",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "event_expiration_time",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "bet_closure_time",
                type: "uint256",
            },
        ],
        name: "event_info",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "string",
                name: "event_id",
                type: "string",
            },
            {
                indexed: false,
                internalType: "string",
                name: "result",
                type: "string",
            },
        ],
        name: "event_result_info",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "platform_fee",
                type: "uint256",
            },
        ],
        name: "platform_fee_info",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "string",
                name: "event_id",
                type: "string",
            },
            {
                indexed: false,
                internalType: "address",
                name: "user_id",
                type: "address",
            },
            {
                indexed: false,
                internalType: "string",
                name: "betting_response",
                type: "string",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "betting_amount",
                type: "uint256",
            },
        ],
        name: "response_info",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "string",
                name: "event_id",
                type: "string",
            },
            {
                indexed: false,
                internalType: "address",
                name: "user_id",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "withdraw_amount",
                type: "uint256",
            },
            {
                indexed: false,
                internalType: "string",
                name: "withdraw_status",
                type: "string",
            },
        ],
        name: "withdraw_info",
        type: "event",
    },
    {
        stateMutability: "payable",
        type: "fallback",
    },
    {
        inputs: [],
        name: "admin",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "event_id",
                type: "string",
            },
            {
                internalType: "address",
                name: "user_id",
                type: "address",
            },
            {
                internalType: "string",
                name: "betting_response",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "betting_amount",
                type: "uint256",
            },
        ],
        name: "bet_event",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "user_id",
                type: "address",
            },
            {
                internalType: "string",
                name: "event_id",
                type: "string",
            },
        ],
        name: "claim_rewards",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "event_id",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "new_bet_closure_time",
                type: "uint256",
            },
        ],
        name: "edit_bet_closure_time",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "event_id",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "new_event_expiration_time",
                type: "uint256",
            },
        ],
        name: "edit_event_expiration_time",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "event_creation_fee",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "event_id",
                type: "string",
            },
            {
                internalType: "string",
                name: "result",
                type: "string",
            },
        ],
        name: "event_result",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "_admin",
                type: "address",
            },
        ],
        name: "initialize",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "platform_fee",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "read_contract_balance",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "event_id",
                type: "string",
            },
        ],
        name: "read_event",
        outputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "event_id",
                        type: "string",
                    },
                    {
                        internalType: "address",
                        name: "event_creator",
                        type: "address",
                    },
                    {
                        internalType: "uint256",
                        name: "event_creation_time",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "event_expiration_time",
                        type: "uint256",
                    },
                    {
                        internalType: "uint256",
                        name: "bet_closure_time",
                        type: "uint256",
                    },
                ],
                internalType: "struct AlephForesight.Event_Storage",
                name: "",
                type: "tuple",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "read_event_creation_fee",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "event_id",
                type: "string",
            },
        ],
        name: "read_event_pool_amount",
        outputs: [
            {
                internalType: "uint256[]",
                name: "",
                type: "uint256[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "event_id",
                type: "string",
            },
        ],
        name: "read_event_result",
        outputs: [
            {
                internalType: "string",
                name: "",
                type: "string",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "read_platform_fee",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "event_id",
                type: "string",
            },
            {
                internalType: "address",
                name: "user_id",
                type: "address",
            },
        ],
        name: "read_response",
        outputs: [
            {
                components: [
                    {
                        internalType: "string",
                        name: "event_id",
                        type: "string",
                    },
                    {
                        internalType: "address",
                        name: "user_id",
                        type: "address",
                    },
                    {
                        internalType: "string",
                        name: "betting_response",
                        type: "string",
                    },
                    {
                        internalType: "uint256",
                        name: "betting_amount",
                        type: "uint256",
                    },
                ],
                internalType: "struct AlephForesight.Response_Storage[]",
                name: "",
                type: "tuple[]",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "event_id",
                type: "string",
            },
            {
                internalType: "uint256",
                name: "event_expiration_time",
                type: "uint256",
            },
        ],
        name: "register_event",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_event_creation_fee",
                type: "uint256",
            },
        ],
        name: "set_event_creation_fee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "_platfrom_fee",
                type: "uint256",
            },
        ],
        name: "set_platform_fee",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "string",
                name: "event_id",
                type: "string",
            },
            {
                internalType: "address",
                name: "user_id",
                type: "address",
            },
        ],
        name: "withdraw_bet",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        stateMutability: "payable",
        type: "receive",
    },
];

export default ContractAbi