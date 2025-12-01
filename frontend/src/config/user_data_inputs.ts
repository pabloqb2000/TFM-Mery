import type { Input } from "../model/inputs";

export const userDataInputs: Input[] = [
    {
        label: "TCA",
        type: "select",
        options: [
            {option: "Yes", keyBind: "y"},
            {option: "No", keyBind: "n"},
        ]
    },
    {
        label: "ASDF",
        type: "number",
    },
]