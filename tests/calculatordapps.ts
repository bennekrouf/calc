import * as anchor from '@project-serum/anchor';
const { SystemProgram } = anchor.web3
import { Calculator } from '../target/types/calculator';
import { Program } from '@project-serum/anchor';
import chai from 'chai';
import { expect } from 'chai';

import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

describe('calc', () => {
    anchor.setProvider(anchor.AnchorProvider.env());
    const program = anchor.workspace.Calculator as Program<Calculator>;
    const programProvider = program.provider as anchor.AnchorProvider;

    const calculatorPair = anchor.web3.Keypair.generate();

    const text = "Hello !!!"
    it('Creates calculator', async () => {
        await program.methods.create(text).accounts(
            {
                calculator: calculatorPair.publicKey,
                user: programProvider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            }
        ).signers([calculatorPair]).rpc()
        const account = await program.account.calculator.fetch(calculatorPair.publicKey)
        expect(account.greeting).to.eql(text)
    })

    it('Adds two numbers',async () => {
        await program.methods.add(new anchor.BN(2), new anchor.BN(3))
        .accounts({
            calculator: calculatorPair.publicKey,
        })
        .rpc()
        const account = await program.account.calculator.fetch(calculatorPair.publicKey)
        expect(account.result).to.eql(new anchor.BN(5))
    })

    it('Multiply two numbers', async () => {
        await program.methods
        .multiply(new anchor.BN(2), new anchor.BN(3))
        .accounts({
            calculator: calculatorPair.publicKey
        })
        .rpc()
        const account = await program.account.calculator.fetch(calculatorPair.publicKey)
        expect(account.result).to.eql(new anchor.BN(6))
    })

    it('Divide two numbers', async () => {
        await program.methods
        .divide(new anchor.BN(10), new anchor.BN(2))
        .accounts({ calculator: calculatorPair.publicKey})
        .rpc()
        const account = await program.account.calculator.fetch(calculatorPair.publicKey)
        expect(account.remainder).to.eql(new anchor.BN(0)) 
        expect(account.result).to.eql(new anchor.BN(5)) 
    })
})