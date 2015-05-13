import com.sun.jna.Pointer;
import com.sun.jna.ptr.IntByReference;
import java.io.*;
import java.util.Arrays;
import java.util.Random;

public class EEGLogFake implements EEGLog{

	public Pointer eEvent;
	public Pointer eState;
	public IntByReference userID;
	public IntByReference nSamplesTaken;
	public Pointer hData;
	public short composerPort					= 1726;
	public int option 								= 2;
	public int state  								= 0;
	public float secs 								= 1;
	public boolean readytocollect 		= false;
	private boolean connected 				= false;
	private int user 									= -1;
	private int TIMEOUT 							= 100000;
	private boolean DEBUG 				= false;


	public static String[] channels = {"COUNTER",
	"AF3","F7", "F3", "FC5", "T7", "P7", "O1", "O2",
	"P8", "T8", "FC6", "F4", "F8", "AF4", "GYROX",
	"GYROY", "TIMESTAMP", "FUNC_ID", "FUNC_VALUE",
	"MARKER", "SYNC_SIGNAL"};

	private static int DATA_OFFSET = 3;
	private static int NUM_CHANNELS = 14;
	private Random rand;

	public EEGLogFake(){
		this.rand = new Random();
	}

	public int tryConnect(){
		return 1;
	}

	public void addUser(){
	  	return;
		// do nothing
	}

	public double[][] getEEG(){
		double[][] data = new double[channels.length][4];
		for(int i = 0; i < channels.length; i++){
			for(int j = 0; j < 4; j++){
				data[i][j] = rand.nextDouble();
			}
		}
		try{
			Thread.sleep(0, 300000);
		}
		catch(InterruptedException e){
			System.out.println("getEEG was interrupted");
		}
		return data;
	}

}
