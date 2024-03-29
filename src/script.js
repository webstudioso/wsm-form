/*eslint no-undef: "off"*/
const script = function (props) {

    this.getComponent = () => {
        return document.getElementById(this.id);
    }

    this.initialize = () => {
        this.getComponent().addEventListener('submit', this.handleSubmit);
    }

    this.sendNotification = (alertSeverity, message, link, timeout) => {
        const detail = { 
            detail: { 
                alertSeverity, 
                message, 
                link,
                timeout
            }
        };
        const cEvent = new CustomEvent('onToast', detail)
        document.dispatchEvent(cEvent);
    }

    this.formatToWei = (value) => {
        const valueInput = typeof value === 'string' ? value : String(value);
        const parsedValue = ethers.utils.parseUnits(valueInput, "ether");
        console.log(`formatToWei input ${value} to ${parsedValue}`);
        return parsedValue;
    }

    this.formatToBytes32 = (value) => {
        const parsedValue = ethers.utils.formatBytes32String(value);
        console.log(`formatToBytes32 input ${value} to ${parsedValue}`);
        return parsedValue;
    }

    this.getAccount = () => {
        const provider = window.walletProvider;
        if (!provider) return;
  
        if (provider.accounts && provider.accounts.length > 0)
          return provider.accounts[0];
  
        return provider.selectedAddress;
    };

    this.getDefaultValue = (component, required) => {
        const attr = component.elements[required];
        // Default value?
        let defaultValue;
        const defaultContent = attr?.attributes?.defaultValue?.value;
        switch (defaultContent) {
            case 'userAddress':
                defaultValue = this.getAccount();
            break;
            default:
        }
        console.log(`Default value for ${required} is ${defaultValue}`);
        return defaultValue;
    }

    this.getValue = (component, required) => {
        const attr = component.elements[required];
        let value = attr.value || this.getDefaultValue(component, required);
        const format = attr?.attributes?.format?.value;
        // Does it require parsing?
        switch(format) {
            case 'toWei':
                value = this.formatToWei(value);
            break;
            case 'toBytes32':
                value = this.formatToBytes32(value);
            break;
            default:
                // Do nothing
                
        }
        console.log(`getValue for input ${required} is ${value}`);
        return value;
    }

    this.getAbi = () => {
        return JSON.parse(props.abi);
    }

    this.getMethod = () => {
        const abi = this.getAbi();
        const method = abi.find((item) => item.name === props.method);
        console.log(`getMethod ${method}`);
        return method;
    }

    this.getProvider = () => {
        const provider = new ethers.providers.Web3Provider(window?.walletProvider);
        return provider;
    }

    this.getSigner = () => {
        const provider = this.getProvider();
        const signer = provider.getSigner();
        return signer;
    }

    this.getFunction = () => {
        const signer = this.getSigner();
        const abi = this.getAbi();
        const method = this.getMethod();
        const contract = new ethers.Contract(props.contract, abi, signer);
        const targetFunction = contract[method.name];
        console.log(`getFunction ${targetFunction}`);
        return targetFunction;
    }

    this.parseMethodInputs = (method) => {
        return method?.inputs?.map((input) => input.name) || [];
    }

    this.getAttributes = () => {
        const method = this.getMethod();
        const requiredAttributes = this.parseMethodInputs(method);
        const args = [];
        const component = this.getComponent();
        // Function args
        requiredAttributes.forEach((required) => args.push(this.getValue(component, required)));
        const txOptions = this.getOptions(component)
        // TX args
        if (txOptions) {
            args.push(txOptions)
        }
        console.log(`Attributes to pass ${JSON.stringify(args)}`)
        return args;
    }

    this.isOptional = (attr) => {
        const isOptional = !!attr?.attributes?.txOption
        return isOptional
    }

    this.getOptions = (component) => {
        const attrs = Object.keys(component.elements)
        const args = {}
        attrs.forEach((attr) => {
            const field = component.elements[attr]
            if (this.isOptional(field)) {
                const fieldValue = this.getValue(component, attr)
                args[field.name] = fieldValue
            }
        })
        return args
    }

    this.handleSubmit = (e) => {
        e?.preventDefault();
        try {
            const targetFunction = this.getFunction();
            const targetAttributes = this.getAttributes();
            const scope = this;
            console.log(`Invoking target function with attributes ${targetAttributes}, is function? ${targetFunction instanceof Function}`);
            targetFunction.apply(null, targetAttributes)
                .then((response) => {
                    console.log(`Response received ${response}`);
                    scope.sendNotification(
                        'success', 
                        'Your transaction was successful, view it on the explorer',
                        `${props.explorerUrl}/tx/${response.hash}`,
                        5000
                    )
                }, (error) => {
                    console.log(`Error received ${error}`);
                    scope.sendNotification(
                        'error', 
                        error?.message,
                        null,
                        5000
                    )
                });
        } catch (e) {
            console.log(`Method call failed received ${e}`);
            this.sendNotification(
                'error', 
                e,
                null,
                5000
            )
        }
    }

    this.initialize();
    return this;
};

export default script;