
const BirthDateRegistry = artifacts.require('./BirthDateRegistry.sol')

contract('BirthDateRegistry', (accounts) => {
    before (async () =>{
        this.birthDetailRegistry = await BirthDateRegistry.deployed();
    })

    it('deploys successfully', async()=>{
        const address = await this.birthDetailRegistry.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('lists birthDetails', async()=>{
        const birthDetailCount = await this.birthDetailRegistry.birthDetailsCount();
        const birthDetail = await this.birthDetailRegistry.birthDetails(birthDetailCount);
        assert.equal(birthDetail.id.toNumber(), birthDetailCount.toNumber());
    })

    it('creates birth detail', async()=>{
        const result = await this.birthDetailRegistry.createBirthDetail("1234567",
        "02/02/1997", "Udochuks Pato Chib", "12345", "67890");
        const birthCount = await this.birthDetailRegistry.birthDetailsCount();
        assert.equal(birthCount, 2);
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
    })
    
    it('toggle birth detail verification', async()=>{
            const result = await this.birthDetailRegistry.toggleVerification(1)
            const birthDetail  =  await this.birthDetailRegistry.birthDetails(1)
            assert.equal(birthDetail.verified, false)
    })

})

