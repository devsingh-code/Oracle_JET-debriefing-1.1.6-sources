define(['knockout', 'utils/signature'], (ko, Signature) => {

    suite('Signature', () => {

        let element;
        let element1;
        let noConvas;
        suiteSetup(async () => {
            //var el = document.getElementById("canvas");
           // if (!document.getElementById("canvas")) {
                element = document.createElement("canvas");
                element1 = document.createElement("button_clear_canvas");
                noConvas = document.createElement("noConvas");
                /*
                sinon.stub(document, 'getElementById')
                .withArgs('canvas_invoice')
                .returns(element)
                .withArgs('button_clear_canvas')
                .returns(element1).withArgs('printableSignatureCanvas')
                .returns(element);

        }
                 */
        });



        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('Constructor is working', (() => {
            let signature2 = new Signature(element);

            window.ontouchstart = "true";
            element.dispatchEvent(new MouseEvent('mousedown', {
                view: window,
                bubbles: true,
                cancelable: true
            }));
            let signature1 = new Signature(element);
            element.dispatchEvent(new MouseEvent('mousemove', {
                view: window,
                bubbles: true,
                cancelable: true
            }));
            let signature3 = new Signature(element);
            element.dispatchEvent(new MouseEvent('mouseup', {
                view: window,
                bubbles: true,
                cancelable: true
            }));
            let signature4 = new Signature(element);
           // let sig = new Signature(noConvas);
            //let sig1 = new Signature(false);
        }));

        test('Failure Scenario 1', (() => {
            try {
                let sig = new Signature(noConvas);
            }catch(e){

            }
        }));

        test('Failure Scenario 2', (() => {
            try {
                let sig1 = new Signature(false);
            }catch(e){

            }
        }));
    });

});