export interface Input {
    label: string;
    value?: string;
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'file' | 'email' | 'password' | 'tel' | 'url' | 'search' | 'range' | 'color' | 'datetime-local' | 'month' | 'time' | 'week';
    options?: string[] | KeyBindedOption[];
    required?: boolean;
    disabled?: boolean;
    readonly?: boolean;
    placeholder?: string;
    className?: string;
    style?: React.CSSProperties;
}

export interface KeyBindedOption {
    option: string;
    keyBind: string;
}