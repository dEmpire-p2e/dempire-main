package com.iconloop.score.example;


import com.iconloop.score.token.irc31.IRC31Basic;
import java.math.BigInteger;
import score.annotation.External;
import score.Address;
import score.Context;
import score.DictDB;
import score.BranchDB;
import score.annotation.Optional;


public class Asset extends IRC31Basic {

    private Address gameContract;
    private final BranchDB<Address, DictDB<BigInteger, BigInteger>> lockedAssets = Context.newBranchDB("lockedAssets", BigInteger.class);;

    public Asset(Address gameContract){
        super();
        this.gameContract = gameContract;
        super._setTokenURI(BigInteger.valueOf(0), "https://dempire.co/miner");
        super._setTokenURI(BigInteger.valueOf(1), "https://dempire.co/cannon");
        super._setTokenURI(BigInteger.valueOf(2), "https://dempire.co/xbow");
        super._setTokenURI(BigInteger.valueOf(3), "https://dempire.co/tesla");
        super._setTokenURI(BigInteger.valueOf(4), "https://dempire.co/townhall");
        super._setTokenURI(BigInteger.valueOf(5), "https://dempire.co/archer");
        super._setTokenURI(BigInteger.valueOf(6), "https://dempire.co/robot");
        super._setTokenURI(BigInteger.valueOf(7), "https://dempire.co/valkariyee");
    }

    private void onlyGameContraact(){
        Context.require(Context.getCaller().equals(gameContract), "Only game contract can call this function");
    }

    @External(readonly = true)
    public BigInteger[] getAssets(Address owner){
        BigInteger[] out = new BigInteger[]{BigInteger.ZERO,BigInteger.ZERO,BigInteger.ZERO,BigInteger.ZERO,BigInteger.ZERO,BigInteger.ZERO,BigInteger.ZERO,BigInteger.ZERO};
        out[0] = balanceOf(owner, BigInteger.valueOf(0));
        out[1] = balanceOf(owner, BigInteger.valueOf(1));
        out[2] = balanceOf(owner, BigInteger.valueOf(2));
        out[3] = balanceOf(owner, BigInteger.valueOf(3));
        out[4] = balanceOf(owner, BigInteger.valueOf(4));
        out[5] = balanceOf(owner, BigInteger.valueOf(5));
        out[6] = balanceOf(owner, BigInteger.valueOf(6));
        out[7] = balanceOf(owner, BigInteger.valueOf(7));
        return out;
    }

    @External()
    public void mint(BigInteger id, Address receiver){
        onlyGameContraact();
        super._mint(receiver, id, BigInteger.ONE);
    }


    @External()
    public void lock(BigInteger id, BigInteger amount, Address owner){
        onlyGameContraact();
        BigInteger available = super.balanceOf(owner, id).subtract(amount);
        Context.require(available.compareTo(BigInteger.ZERO) != -1 , "Locking more assets then you have!");
        lockedAssets.at(owner).set(id, amount);
    }

    @Override
    @External()
    public void transferFrom(Address _from, Address _to, BigInteger _id, BigInteger _value, @Optional byte[] _data){
        BigInteger locked = lockedAssets.at(_from).getOrDefault(_id, BigInteger.ZERO);
        BigInteger available = super.balanceOf(_from, _id).subtract(locked);
        Context.require(available.compareTo(_value) != -1 , "Not enough balance!");
        super.transferFrom(_from, _to, _id, _value, _data);
    }

    @Override
    @External()
    public void transferFromBatch(Address _from, Address _to, BigInteger[] _ids, BigInteger[] _values, @Optional byte[] _data) {
        for (int i = 0; i < _ids.length; i++) {
            BigInteger _id = _ids[i];
            BigInteger _value = _values[i];
            BigInteger locked = lockedAssets.at(_from).getOrDefault(_id, BigInteger.ZERO);
            BigInteger available = super.balanceOf(_from, _id).subtract(locked);
            Context.require(available.compareTo(_value) != -1 , "Not enough balance!");
        }
        super.transferFromBatch(_from, _to, _ids, _values, _data);
    }

    @External(readonly=true)
    public String name() {
        return "DempireAssets";
    }

}
