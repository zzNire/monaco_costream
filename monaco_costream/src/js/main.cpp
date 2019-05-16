double PI =  3.141592654;

//double Wn[N/2] = {0};
void getName(){
 
}
getName();

class test{
public:

private:
}
//对应中文版算法导论513页RECURSIVE-FFT(a)函数
composite Combine(output stream<double x>Out, input stream<double x>In)
{
	param
		int TN;

	Out = CombineDFTX(In)
	{
		double wn_r = cos(2 * PI / TN);
		double wn_i = sin(2 * PI / TN);
		work
		{
			int i;
			double w_r = 1, w_i = 0;
			double results[2 * TN];
			double y0_r, y0_i, y1_r, y1_i;
			double y1w_r, y1w_i, w_r_next, w_i_next;

			for (i = 0; i < TN; i += 2)
			{
				y0_r = In[i].x;
				y0_i = In[i+1].x;

				y1_r = In[TN+i].x;
				y1_i = In[TN+i+1].x;

				y1w_r = y1_r * w_r - y1_i * w_i;
				y1w_i = y1_r * w_i + y1_i * w_r;

				results[i] = y0_r + y1w_r;
				results[i + 1] = y0_i + y1w_i;

				results[TN + i] = y0_r - y1w_r;
				results[TN + i + 1] = y0_i - y1w_i;

				w_r_next = w_r * wn_r - w_i * wn_i;
				w_i_next = w_r * wn_i + w_i * wn_r;
				w_r = w_r_next;
				w_i = w_i_next;
			}

			for (i = 0; i < 2 * TN; i++)
			{
				Out[i].x = results[i];
			}
		}
		window{
			In  sliding(2 * TN,2 * TN);
			Out tumbling(2 * TN);
		}
	};
}

composite SecondSource(output stream<double x>Out, input stream<double x>In)
{
	param
	    int N;
	Out = AssignmentX(In)
	{
		work
		{
			int i;
			println("\nOut:");
			for (i = 0; i<N*2; i++)
			{
			    Out[i].x = In[0].x + i;
			  	print(Out[i].x);
			}
			println('\n');
		}
		window {
	    In  sliding(1,1);
		Out	tumbling(N*2);
	    }
	};
}

//对应《算法导论》518页BIT-REVERSE_COPY函数.
//参考http://blog.csdn.net/jakee304/article/details/2152655的第三种算法，略加修改
//正确性待验证（3、14验证正确，与fft5的结果一致，但未理解输入输出数据
composite FFTReorder(output stream<double x>Out, input stream<double x>In)
{
	param
		int n;
	Out = FFTReorderSimpleX(In)
	{
		work
		{
		    int i,j,k;
			int m = 0;
			int final[n];

			for(i=0;i<n;i++)
				final[i]=0;

			for(i=0;i<n;i++){
				int c = i;
				for(j=0;j<log(n);j++){
					final[i] <<= 1;
					final[i] |= (c&1);
					c >>= 1 ;
				}
			}
			for(i = 0; i < n; i++){
				Out[final[i]*2].x = In[i*2].x;
			    Out[final[i]*2+1].x = In[i*2+1].x;
			}
		}
		window {
		    In sliding(2*n,2*n);
			Out tumbling(2*n);
		}
	};
}

composite CombineDFT(output stream<double x>Out, input stream<double x>In)
{
	param
		int n;
	Out = pipeline(In)
	{
		int j;
		for(j=2; j<=n; j*=2)
			add Combine(j);
	};
}

composite Main()
{
    //int P[2*N];
	int N = 8;
	stream<double x> Source,CDFT;

	Source = FloatSource()
	{
		double max = 1000.0;
		double current = 0.0;
		work
		{
			if (current > max)
				current = 0.0;
			Source[0].x = current;
			current += 2 * N;
		}
		window {
			Source tumbling(1);
		}
	};
	CDFT = pipeline(Source){
	    add SecondSource(N);
		add FFTReorder(N);
		add CombineDFT(N);
	};
	FloatSink(CDFT)
	{
		work
		{
			println(CDFT[0].x);
		}
	};
}
