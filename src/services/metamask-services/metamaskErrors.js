export const metamaskErrorFinder = (error, customMessage) => {
  const metamaskErrors = {
    '-32000': 'Insufficient funds available.',
    '-32603': 'Transfer amount exceeds balance.',
    '-32002': 'Please disconnect Metamask first',
    4001: 'User rejected the request.',
    4100: 'Unauthorized request. Please connect MetaMask.',
    4200: 'Unsupported Ethereum provider method. Please update MetaMask.',
    4900: 'Disconnected from the Ethereum network.',
    4901: 'MetaMask is connected to an unsupported network.',
    3: 'Execution reverted: The transfer amount exceeds the available balance.',
    32000: 'Gas limit exceeds block gas limit.',
    32001: 'Insufficient funds for gas * price + value.',
    32002: 'Transaction exceeds the maximum allowed gas.',
    32003: 'Transaction nonce is too low.',
    32004: 'The gas price provided is too low.',
    32005: 'Transaction underpriced. Please increase the gas price.',
    32006: 'Intrinsic gas exceeds gas limit.',
    32007: 'Transaction has already been processed.',
    32008: 'Max priority fee per gas is higher than max fee per gas.',
    32009: 'The provided address is invalid.',
    32010: "Nonce exceeds account's transaction count.",
    32011: 'Transaction reverted without a reason.',
    32012: 'ERC20: transfer amount exceeds balance.',
    32013: 'Contract call execution failed.',
    32014: 'Failed to estimate gas. Please try manually.',
    32015: 'MetaMask connection error. Please reconnect or restart.',
    32016: 'MetaMask is not installed or detected.',
    32017: 'Signature request was canceled by the user.'
  };

  return metamaskErrors[error?.code] ? metamaskErrors[error.code] : customMessage;
};
