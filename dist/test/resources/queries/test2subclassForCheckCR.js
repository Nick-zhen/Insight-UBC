"use strict";
{
    "title";
    "ORDER key must in columns",
        "input";
    {
        "WHERE";
        {
            "AND";
            [
                {
                    "IS": {
                        "rooms_furniture": "*Tables*"
                    }
                },
                {
                    "GT": {
                        "rooms_seats": 300
                    }
                }
            ];
        }
        "OPTIONS";
        {
            "COLUMNS";
            [
                "rooms_shortname",
                "maxSeats"
            ],
                "ORDER";
            {
                "dir";
                "DOWN",
                    "keys";
                [
                    "maxSeats"
                ];
            }
        }
        "TRANSFORMATIONS";
        {
            "GROUP";
            [
                "rooms_shortname"
            ],
                "APPLY";
            [
                {
                    "maxSeats": {
                        "MAX": "rooms_seats"
                    }
                }
            ];
        }
    }
    "errorExpected";
    true,
        "with";
    "InsightError";
}
//# sourceMappingURL=test2subclassForCheckCR.js.map