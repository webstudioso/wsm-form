import script from "../script";

const abi = `[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_to",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "_ipfsHash",
          "type": "bytes32"
        }
      ],
      "name": "mint",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
]`;

describe("Form script", () => {

    let spyFind, spyAddListener, mockElement;

    const orgDoc = document;
    beforeAll(() => {
        document = orgDoc;
        mockElement = document.createElement('form');
        mockElement.id = 'w3form';
        spyAddListener = jest.spyOn(mockElement, 'addEventListener');
        spyFind = jest.spyOn(document, 'getElementById');
        spyFind.mockReturnValue(mockElement);

        global.ethers = {
            utils: {
                parseUnits: jest.fn(),
                formatBytes32String: jest.fn()
            },
            providers: {
                Web3Provider: jest.fn().mockImplementation(() => {
                    return {
                        getSigner: jest.fn()
                    }
                })
            },
            Contract: jest.fn().mockImplementation(() => {
                return {
                    mint: jest.fn()
                }
            })
        };
    });

    describe("getComponent", () => {
        it("Finds parent form", async () => {
            const fn = new script();
            const component = fn.getComponent();
            expect(component).toBe(mockElement);
        });
    })

    describe("initialize", () => {
        it("Finds and attachs click behavior to form parent component", async () => {
            new script();
            expect(spyFind).toHaveBeenCalled();
            expect(spyAddListener).toHaveBeenCalled();
        });
    })

    describe("sendNotification", () => {
        it("Dispatches custom event onToast with parameters", async () => {
            const onToast = new CustomEvent('onToast', {
                detail: {
                    alertSeverity: "success",
                    message: "All done",
                    link: "https://google.com",
                    timeout: 1500
                }
            });
            const dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');
            const fn = new script();
            fn.sendNotification("success", "All done", "https://google.com", 1500);
            expect(dispatchEventSpy).toHaveBeenCalledWith(onToast);
        });
    })

    describe("getValue", () => {
        it("Returns unaltered value if no transformer is used", async () => {
            const components = {
                elements: {
                    required: {
                        value: 'Hello world',
                        attributes: {
                            format: {
                                value: 'none'
                            }
                        }
                    }
                }
            };
            const required = 'required';
            const fn = new script();
            const value = fn.getValue(components, required);
            expect(value).toEqual('Hello world');
        });

        it("Calls ethers utils toBytes32 if transformer is used", async () => {
            const components = {
                elements: {
                    required: {
                        value: 'Hello world',
                        attributes: {
                            format: {
                                value: 'toBytes32'
                            }
                        }
                    }
                }
            };
            const required = 'required';
            const fn = new script();
            fn.getValue(components, required);
            expect(global.ethers.utils.formatBytes32String).toHaveBeenCalledWith("Hello world");  
        });

        it("Calls ethers utils parseUnits if transformer is used", async () => {
            const components = {
                elements: {
                    required: {
                        value: '20',
                        attributes: {
                            format: {
                                value: 'toWei'
                            }
                        }
                    }
                }
            };
            const required = 'required';
            const fn = new script();
            fn.getValue(components, required);
            expect(global.ethers.utils.parseUnits).toHaveBeenCalledWith('20', 'ether');  
        });
    });

    describe("formatToWei", () => {
        it("Transforms strings to wei", () => {
            const fn = new script();
            fn.formatToWei(1);
            expect(global.ethers.utils.parseUnits).toHaveBeenCalledWith("1", "ether");  
        });
    });

    describe("formatBytes32String", () => {
        it("Transforms strings to formatBytes32String", () => {
            const fn = new script();
            fn.formatToBytes32("Hello world");
            expect(global.ethers.utils.formatBytes32String).toHaveBeenCalledWith("Hello world");  
        });
    });

    describe("handleSubmit", () => {

        let addrInput, urlInput, onToast, dispatchEventSpy;

        beforeAll(() => {
            dispatchEventSpy = jest.spyOn(document, 'dispatchEvent');
            onToast = new CustomEvent('onToast', {
                detail: {
                    alertSeverity: "success",
                    message: "All done",
                    link: "https://google.com",
                    timeout: 1500
                }
            });
            // Mock child inputs
            addrInput = document.createElement('input');
            addrInput.setAttribute("type", "text");
            addrInput.setAttribute("name", "_to");
            addrInput.value = "0x123";
            mockElement.appendChild(addrInput);

            urlInput = document.createElement('input');
            urlInput.setAttribute("type", "text");
            urlInput.setAttribute("name", "_ipfsHash");
            urlInput.value = "https://demo.com";
            mockElement.appendChild(urlInput);
        });

        it("Invokes preventDefault form event on submit", async () => {
            const event = {
                preventDefault: jest.fn()
            }
            const fn = new script();
            fn.handleSubmit(event);
            expect(event.preventDefault).toHaveBeenCalled();
        });

        it("On error sends a notification with the error message", async () => {
            const fn = new script();
            fn.handleSubmit();
            expect(dispatchEventSpy).toHaveBeenCalled();
        });

        it("Invokes function with parameters from form inputs", async () => {
            const props = {
                abi,
                method: 'mint'
            }
            const fn = new script(props);
            fn.getFunction = () => { return jest.fn().mockResolvedValue({ hash: '123' }) }
            fn.sendNotification = jest.fn();
            fn.handleSubmit();
            expect(dispatchEventSpy).toHaveBeenCalledWith(onToast);
        });

        it("Invokes function with parameters from form inputs", async () => {
            const props = {
                abi,
                method: 'mint'
            }
            const fn = new script(props);
            fn.getFunction = () => { return jest.fn().mockResolvedValue({ hash: '123' }) }
            fn.sendNotification = jest.fn();
            fn.handleSubmit();
            expect(dispatchEventSpy).toHaveBeenCalledWith(onToast);
        });

        it("Displays network error when onchain call fails", async () => {
            const props = {
                abi,
                method: 'mint'
            }
            const errorMessage = 'details here';
            const onError = new CustomEvent('onToast', {
                detail: {
                    alertSeverity: "error",
                    message: errorMessage,
                    link: null,
                    timeout: 5000
                }
            });
            const fn = new script(props);
            fn.getFunction = () => { return jest.fn().mockRejectedValue(new Error(errorMessage)) }
            fn.handleSubmit();
            expect(dispatchEventSpy).toHaveBeenCalledWith(onError);
        });
    });

    describe("getAbi", () => {
        it("Parses a string abi into a json object", async () => {
            const props = {
                abi
            }
            const fn = new script(props);
            const parsedAbi = fn.getAbi();
            expect(parsedAbi[0].name).toBe('mint');
            expect(parsedAbi[0].inputs.length).toEqual(2);
        });
    });

    describe("getMethod", () => {
        it("Finds the method within the abi and returns it", async () => {
            const props = {
                abi,
                method: 'mint'
            }
            const fn = new script(props);
            const method = fn.getMethod();
            expect(method.name).toBe('mint');
            expect(method.inputs.length).toEqual(2);
        });
    });

    describe("getProvider", () => {
        it("Returns the current provider", async () => {
            const fn = new script();
            fn.getProvider();
            expect(global.ethers.providers.Web3Provider).toHaveBeenCalled();
        });
    });

    describe("getSigner", () => {
        it("Returns the current signer", async () => {
            const fn = new script();
            const getSigner = jest.fn();
            fn.getProvider = jest.fn().mockImplementation(() => {
                return { getSigner }
            })
            fn.getSigner();
            expect(getSigner).toHaveBeenCalled();
        });
    });

    describe("getFunction", () => {
        it("Returns the contract function ready to be invoked", async () => {
            const props = {
                abi,
                method: 'mint'
            }
            const fn = new script(props);
            const getSigner = jest.fn();
            fn.getProvider = jest.fn().mockImplementation(() => {
                return { getSigner }
            })
            fn.getFunction();
            expect(global.ethers.Contract).toHaveBeenCalled();
        });
    });

    describe("getAttributes", () => {

        let addrInput, urlInput;
        beforeAll(() => {
            // Mock child inputs
            addrInput = document.createElement('input');
            addrInput.setAttribute("type", "text");
            addrInput.setAttribute("name", "_to");
            addrInput.value = "0x123";
            mockElement.appendChild(addrInput);

            urlInput = document.createElement('input');
            urlInput.setAttribute("type", "text");
            urlInput.setAttribute("name", "_ipfsHash");
            urlInput.value = "https://demo.com";
            mockElement.appendChild(urlInput);
        });

        it("Returns list of attribute values from form", async () => {
            const props = {
                abi,
                method: 'mint'
            }
            const fn = new script(props);
            const attrs = fn.getAttributes();
            console.log(attrs);
            expect(global.ethers.Contract).toHaveBeenCalled();
        });
    });

    describe("parseMethodInputs", () => {
        it("Returns list of attribute names required by method name", () => {
            const props = {
                abi,
                method: 'mint'
            }
            const fn = new script(props);
            const abiContent = fn.getAbi();
            const method = abiContent[0];
            const attrs = fn.getAttributes(method);
            expect(attrs.length).toBe(2);
        });

        it("Returns empty attributes if method has no inputs", () => {
            const abiContentEmpty = [
                {
                  "inputs": [],
                  "name": "mint",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                }
            ];
            const abiContentNull = [
                {
                  "name": "mint",
                  "outputs": [],
                  "stateMutability": "nonpayable",
                  "type": "function"
                }
            ];
            const fn = new script({ abi });
            expect(fn.getAttributes(abiContentEmpty[0]).length).toBe(0);
            expect(fn.getAttributes(abiContentNull[0]).length).toBe(0);
            expect(fn.getAttributes().length).toBe(0);
        });
    });

    describe("getAccount", () => {

        it("Returns is no provider is found", () => {
            window.walletProvider = null;
            const fn = new script();
            const account = fn.getAccount();
            expect(account).toBe(undefined);
        });

        it("Returns first address if in account list", () => {
            window.walletProvider = {
                accounts: [
                    '0x1'
                ],
                selectedAddress: '0x1'
            }
            const fn = new script();
            const account = fn.getAccount();
            expect(account).toBe(window.walletProvider.accounts[0]);
        });

        it("Returns selected address if account list empty", () => {
            window.walletProvider = {
                accounts: [
                ],
                selectedAddress: '0x1'
            }
            const fn = new script();
            const account = fn.getAccount();
            expect(account).toBe(window.walletProvider.selectedAddress);
        });
    });

    describe("getDefaultValue", () => {
        it("Returns default value as user wallet address if specified", () => {
            window.walletProvider = {
                accounts: [
                ],
                selectedAddress: '0x1'
            }
            const component = {
                elements: {
                    _to: {
                        attributes: {
                            defaultValue: {
                                value: 'userAddress'
                            }
                        }
                    }
                }
            };
            const required = '_to';
            const fn = new script();
            const defaultValue = fn.getDefaultValue(component, required);
            expect(defaultValue).toBe('0x1');
        });
    });
});
