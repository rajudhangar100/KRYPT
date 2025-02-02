import React,{useState,useEffect} from "react";
import { ethers } from "ethers";
import { createContext } from "react";
import { contractAbi,contractAddress } from "../utils/constants";

export const TransactionContext = createContext();

const { ethereum } = window;

const getEthereumContract = () =>{
    if(!window.ethereum)    return alert("Install metamask");
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const TransactionContract = new ethers.Contract(contractAddress,contractAbi,signer);
    return TransactionContract;
}

export const TransactionProvider=({children})=>{
    const [transactionCount, settransactionCount] = useState(localStorage.getItem("transactionCount"));
    const [transactions,setTransactions]=useState([]);
    const [formData,setformData]=useState({
        addressTo: "",
        amount:"",
        keyword:"",
        message:""
    })
    const [currentAccount, setcurrentAccount] = useState("")
    const [isLoading, setisLoading] = useState(false);
    const handleChange=(e,name)=>{
        setformData((prev)=>({...prev, [name]: e.target.value}));
    }
    const checkifWalletisConnected = async () =>{
        try {
            if(!ethereum)   return alert("Please Install MetaMask");
            const account = await ethereum.request({ method : 'eth_accounts'});
            if(account.length){
                setcurrentAccount(account[0]);
                getAllTransactions();
            }else    console.log("Accounts Doesn't Exist.");   
        } catch (error) {
            console.error(error);
            throw new Error("Error in Checking wallet is connected or not");
        }
    }
    useEffect( () => {
      checkifWalletisConnected();
    }, [])
    const connectWallet = async () =>{
        try{
            if(!ethereum)   return alert("Please Install MetaMask");
            const accounts = await ethereum.request({ method : 'eth_requestAccounts'}); //It will list all the accounts conn to MM
            setcurrentAccount(accounts[0]);
        }catch(error){
            console.error(error);
            throw new Error("Error in connecting wallet");
        }
    }
    const sendTransaction = async () =>{
        try{
            if(!ethereum)   return alert("Please Install MetaMask");
            const { addressTo, amount, keyword, message } = formData;
            if (!ethers.utils.isAddress(addressTo)) {
                alert("❌ Invalid recipient address!");
                return;
            }    
            const TransactionContract=getEthereumContract();
            
            const parsedAmount = ethers.utils.parseEther(amount);
            console.log("Type of ParsedAmount:",(parsedAmount));
            await ethereum.request({
                method: "eth_sendTransaction",
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', 
                    value: parsedAmount._hex,                    
                }]
            })

            const TransactionHash = await TransactionContract.addtoBlockchain(addressTo,parsedAmount,message,keyword);
            setisLoading(true);
            console.log("Loading - ",TransactionHash.hash);
            await TransactionHash.wait();
            setisLoading(false);
            console.log("Success - ",TransactionHash.hash);
            
            const transactionCount=await TransactionContract.totalTransactions();
            settransactionCount(transactionCount.toNumber());
        }catch(error){
            console.error(error);
            throw new Error("Error in Sending transaction");
        }
    }
    const getAllTransactions = async () => {
        try {
          if (ethereum) {
            const transactionsContract = getEthereumContract();
    
            const availableTransactions = await transactionsContract.AllTransactions();
    
            const structuredTransactions = availableTransactions.map((transaction) => ({
              addressTo: transaction.receiver,
              addressFrom: transaction.sender,
              timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
              message: transaction.message,
              keyword: transaction.keyword,
              amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }));
    
            console.log(structuredTransactions);
    
            setTransactions(structuredTransactions);
          } else {
            console.log("Ethereum is not present");
          }
        } catch (error) {
          console.log(error);
        }
      };
    
    return (
    <TransactionContext.Provider value={{connectWallet,currentAccount,formData,handleChange,sendTransaction,transactions}}>
        {children}
    </TransactionContext.Provider>
    )
}





//We can pass functions as well in context hook and directly 
//run that in accessed component by destructuring 


//Progress: 
//Created a function which checks if mm is there, and if wallet is connected or not
//iF not connected, it shows a button on click it will call a function which will give a req to mm to connect accounts.
//Now, Main Imp to create Send functions: here, i have to run the sc by passing the params such as receiver address,msg,..
//and listen to the event emitted by the Sc and finally wrap up the function

//HandleChange:
//usecase: Jo form frontend mai hai,uske values ko useState ke andar store karne ke liye function hai..
//so onclick on any input field this will run 
//and it will pass two params: 
//e: The event object that holds details about the input event (like the new value of the input field).
//name: The name of the input field (e.g., "addressTo", "amount", "keyword", "message").
//e.target.value gives us the current value that the user has typed into the input field.
// prevState represents the existing values in the form before the user types.
// { ...prevState, [name]: e.target.value } creates a new object with all old values (prevState),
//  but updates only the field that changed (name).