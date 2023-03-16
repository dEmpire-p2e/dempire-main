package com.iconloop.score.example;

import score.Context;
import score.Address;
import score.VarDB;
import score.DictDB;
import score.annotation.External;
import score.annotation.Payable;
import com.iconloop.score.token.irc2.IRC2Basic;

import java.math.BigInteger;


public class MainGame  extends IRC2Basic {

    private final VarDB<Address> assetContract = Context.newVarDB("assetContract", Address.class);
    private final VarDB<BigInteger> nextPlayer = Context.newVarDB("nextPlayer", BigInteger.class);
    private final DictDB<Address, String>  playersEmpire =  Context.newDictDB("playersEmpire", String.class);
    private final DictDB<BigInteger, Address>  players =  Context.newDictDB("players", Address.class);

    private Address owner;

    public MainGame(String _name, String _symbol, int _decimals) {
        super( _name, _symbol, _decimals);
        this.owner = Context.getCaller();
    }

    @External()
    public void setAssetAddress(Address assetContract){
        Context.require(Context.getCaller().equals(owner), "Only owner can call!");
        this.assetContract.set(assetContract);
    }

    @External()
    public void startGame(){
        Context.require(playersEmpire.getOrDefault(Context.getCaller(), "").equals(""), "Game Already Started!");
        Context.call(assetContract.get(), "mint", BigInteger.valueOf(4), Context.getCaller());
        _mint(Context.getCaller(), BigInteger.valueOf(1000));
        BigInteger np = nextPlayer.getOrDefault(BigInteger.ZERO);
        players.set(np, Context.getCaller());
        playersEmpire.set(Context.getCaller(), "{'address':'', 'buil':[]}");
        nextPlayer.set(np.add(BigInteger.ONE));
    }


    @External()
    public  void saveGame(String data){
        playersEmpire.set(Context.getCaller(), data);
    }

    @External(readonly = true)
    public  boolean isGameStarted(Address owner){
        return playersEmpire.getOrDefault(owner, "").equals("");
    }

    @External(readonly = true)
    public String getEmpireByID(BigInteger id){
        return playersEmpire.getOrDefault(players.get(id) , "{'address':'', 'buil':[]}");
    }

    @External(readonly = true)
    public  BigInteger getNextPlayer(){
        return  nextPlayer.get();
    }

    @External(readonly = true)
    public  String getEmpire(Address owner){
        return  playersEmpire.getOrDefault(owner , "{'address':'', 'buil':[]}");
    }

    @External()
    public void reward(BigInteger buildings){
        // this function will get secured in future version using oracles and verfied caller
        _mint(Context.getCaller(), buildings.multiply(BigInteger.valueOf(25)));
    }

    @External()
    public void buy(BigInteger id){
        if(id.compareTo(BigInteger.valueOf(0))==0){
            //miner
            _burn(Context.getCaller(), BigInteger.valueOf(100));
        }else if(id.compareTo(BigInteger.valueOf(1))==0){
            //cannon
            _burn(Context.getCaller(), BigInteger.valueOf(250));
        }else if(id.compareTo(BigInteger.valueOf(2))==0){
            //xbow
            _burn(Context.getCaller(), BigInteger.valueOf(150));
        }else if(id.compareTo(BigInteger.valueOf(3))==0){
            //tesla
            _burn(Context.getCaller(), BigInteger.valueOf(200));
        }else if(id.compareTo(BigInteger.valueOf(5))==0){
            //archer
            _burn(Context.getCaller(), BigInteger.valueOf(50));
        }else if(id.compareTo(BigInteger.valueOf(6))==0){
            //robot
            _burn(Context.getCaller(), BigInteger.valueOf(65));
        }else if(id.compareTo(BigInteger.valueOf(7))==0){
            //valkariyee
            _burn(Context.getCaller(), BigInteger.valueOf(70));
        }
        Context.call(assetContract.get(), "mint", id, Context.getCaller());
    }

    @Payable
    public void fallback(){}

}
