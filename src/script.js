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
        return ethers.utils.parseUnits(valueInput, "ether");
    }

    this.formatToBytes32 = (value) => {
        return ethers.utils.formatBytes32String(value);
    }

    this.getValue = (component, required) => {
        const attr = component.elements[required];
        let value = attr.value;
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
        return value;
    }

    this.getAbi = () => {
        return JSON.parse(props.abi);
    }

    this.getMethod = () => {
        const abi = this.getAbi();
        const method = abi.find((item) => item.name === props.method);
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
        requiredAttributes.forEach((required) => args.push(this.getValue(component, required)));
        return args;
    }

    this.handleSubmit = (e) => {
        e?.preventDefault();
        try {
            const targetFunction = this.getFunction();
            const targetAttributes = this.getAttributes();
            const scope = this;
            targetFunction(...targetAttributes)
                .then((response) => {
                    scope.sendNotification(
                        'success', 
                        'Your transaction was successful, view it on the explorer',
                        `${props.explorerUrl}/tx/${response.hash}`,
                        5000
                    )
                }, (error) => {
                    scope.sendNotification(
                        'error', 
                        error?.message,
                        null,
                        5000
                    )
                });
        } catch (e) {
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