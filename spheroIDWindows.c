#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main(){
	FILE *fp;
	char buf[255];
	fp = fopen("./spheros.txt", "r");
	fscanf(fp, "%s", buf);
	int numSpheros = atoi(buf);
	int i=0;
	char response[255] = "\0";
	for(i=0; i<numSpheros; i++){
		char name[20], port[20];
		fscanf(fp, "%s", name);
		fscanf(fp, "%s", port);
		strcat(response, port);
		strcat(response, " ");
		strcat(response, name);
		strcat(response, ";");	
	}

	printf("%s\n", response);
}
