export const connection = bool => ({
    type: 'CONNECTION',
    connected: bool,
});

export const error = error => ({
    type: 'ERROR',
    error,
});
