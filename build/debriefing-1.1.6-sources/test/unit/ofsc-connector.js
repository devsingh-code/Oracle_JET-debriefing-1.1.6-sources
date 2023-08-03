define(['knockout', 'ofsc-connector','signals'], (ko, OfscConnector, Signal) => {

    suite('OfscConnector', () => {

        suiteSetup(async () => {

        });



        suiteTeardown(async () => {

        });

        setup(() => {

        });

        teardown(() => {

        });

        test('Constructor is working', (() => {
            let ofscConnector = new OfscConnector();

            let data = {method: "post",
                        apiVersion: "1.0"};
            ofscConnector.sendMessage(data);
            let even = new Event('create');
            ofscConnector.onPostMessage(even);

            expect(ofscConnector).to.be.an.instanceof(OfscConnector);
        }));

        test('SendMessage with basic input is working', (() => {
            let ofscConnector = new OfscConnector();
            let data = {method: "post",
                apiVersion: "1.0"};
            ofscConnector.sendMessage(data);
        }));

        test('getOrigin with String as input', (() => {
            expect(OfscConnector._getOrigin("test")).to.equal('http:test');
        }));

        test('onPostMessage with basic input', (() => {
            let ofscConnector = new OfscConnector();
            let even = new Event('create');
            expect(ofscConnector.onPostMessage(even)).to.equal(false);
        }));

        test('generateCallId ', (() => {
            expect(OfscConnector.generateCallId()).to.be.a('string');
        }));

        test('onPostMessage with data 1', (() => {
            let ofscConnector = new OfscConnector();
            let even = new Event('create');
            let data = {method: "post",
                apiVersion: "1.0"};
            even.data = data;
            expect(ofscConnector.onPostMessage(even)).to.equal(false);

            ofscConnector.sendMessage(data);
        }));

        test('onPostMessage with data 2', (() => {
            let result;
            let ofscConnector = new OfscConnector();
            let even = new Event('create');
            even.data = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
            expect(ofscConnector.onPostMessage(even)).to.equal(result);
        }));

        test('onPostMessage with window 2', (() => {
            let result;
            let ofscConnector = new OfscConnector();

            let even = new Event('create');
            even.data = "{ " + "   \"part_uom_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_uom_code\",\n" + "    \"title\": \"Part Unit of Measure\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "    \"ea\": {\n" + " " + "    \"text\": \"ea\"\n" + "    },\n" + "    \"zzu\": {\n" + "    \"text\": \"ea\"\n" + "    },\n" + "    \"in\": {\n" + "    \"text\": \"in\"\n" + "    },\n" + "    \"m\": {\n" + "    \"text\": \"m\"\n" + "    }\n" + "    }\n" + "},\n" + "    \"part_disposition_code\": {\n" + "    \"fieldType\": \"property\",\n" + "    \"entity\": \"ENTITY_INVENTORY\",\n" + "    \"gui\": \"combobox\",\n" + "    \"label\": \"part_disposition_code\",\n" + "    \"title\": \"Part Disposition\",\n" + "    \"type\": \"enum\",\n" + "    \"access\": \"READ_WRITE\",\n" + "    \"enum\": {\n" + "        \"M\": {\n" + "            \"text\": \"Fast Return\"\n" + "        },\n" + "        \"N\": {\n" + "            \"text\": \"No Return\"\n" + "        },\n" + "        \"S\": {\n" + "            \"text\": \"Slow Return\"\n" + "        }\n" + "    }\n" + "}}\n";
            even.source = window;
            expect(ofscConnector.onPostMessage(even)).to.equal(result);
        }));

        test('getOrigin with Number as input', (() => {
            expect(OfscConnector._getOrigin(123)).to.equal('');
        }));
    });

});